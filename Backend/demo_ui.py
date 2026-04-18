import requests
import streamlit as st

st.set_page_config(page_title="Vaxi Babu Demo", page_icon="💉", layout="wide")
API_URL = "http://localhost:8000/api/v1"

st.title("🩺 Vaxi Babu — Backend Demo")
st.markdown("Test all backend endpoints from this Streamlit UI.")


# ──────────────────────────────────────────────────────────────────────────────
# Check API Connection
# ──────────────────────────────────────────────────────────────────────────────
@st.cache_data(ttl=5)
def check_api_status():
    try:
        resp = requests.get("http://localhost:8000/health", timeout=2)
        return resp.status_code == 200
    except requests.RequestException:
        return False


api_online = check_api_status()
if api_online:
    st.success("✅ Backend Online at http://localhost:8000")
else:
    st.error("🚨 Backend Offline. Run `uvicorn app.main:app --reload` first.")
    st.stop()

# ──────────────────────────────────────────────────────────────────────────────
# Sidebar: Setup
# ──────────────────────────────────────────────────────────────────────────────
st.sidebar.header("🏠 Household & Dependent")

if "household_id" not in st.session_state:
    with st.sidebar.form("create_household"):
        st.subheader("Create Household")
        hh_name = st.text_input("Household Name", "My Family")
        language = st.selectbox("Language", ["en", "hi"])
        village = st.text_input("Village/Town", "")
        state = st.text_input("State", "")
        submitted = st.form_submit_button("Create Household")
        if submitted:
            resp = requests.post(
                f"{API_URL}/households",
                json={
                    "name": hh_name,
                    "primary_language": language,
                    "village_town": village or None,
                    "state": state or None,
                },
            )
            if resp.status_code == 201:
                st.session_state.household_id = resp.json()["id"]
                st.rerun()
            else:
                st.sidebar.error(f"Error: {resp.text}")
else:
    st.sidebar.success(f"Household: {st.session_state.household_id[:8]}...")
    if "dependent_id" in st.session_state:
        st.sidebar.success(f"Dependent: {st.session_state.dependent_id[:8]}...")

    if st.sidebar.button("Reset All"):
        for k in ["household_id", "dependent_id"]:
            st.session_state.pop(k, None)
        st.rerun()

# ──────────────────────────────────────────────────────────────────────────────
# Add Dependent
# ───────────────────────────────────────────────────────────���──────────────────
if "household_id" in st.session_state and "dependent_id" not in st.session_state:
    with st.sidebar.form("add_dependent"):
        st.subheader("Add Child/Dependent")
        dep_name = st.text_input("Name", "Baby")
        dep_type = st.selectbox("Type", ["child", "adult", "elder", "pregnant"])
        dob = st.date_input("Date of Birth")
        sex = st.selectbox("Sex", ["male", "female", "other"])
        submitted = st.form_submit_button("Add & Generate Schedule")
        if submitted:
            resp = requests.post(
                f"{API_URL}/dependents",
                json={
                    "household_id": st.session_state.household_id,
                    "name": dep_name,
                    "type": dep_type,
                    "date_of_birth": dob.strftime("%Y-%m-%d"),
                    "sex": sex,
                },
            )
            if resp.status_code == 201:
                st.session_state.dependent_id = resp.json()["id"]
                st.rerun()
            else:
                st.sidebar.error(f"Error: {resp.text}")

# ──────────────────────────────────────────────────────────────────────────────
# Main Tabs
# ──────────────────────────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["📅 Timeline", "💊 Medicine", "🗣️ Voice"])

# ─── TAB 1: Timeline ───
with tab1:
    if "dependent_id" not in st.session_state:
        st.info("👈 Create a Household and add a Dependent in the sidebar.")
    else:
        resp = requests.get(f"{API_URL}/timeline/{st.session_state.dependent_id}")
        if resp.status_code == 200:
            data = resp.json()

            # Next due
            if data.get("next_due"):
                nd = data["next_due"]
                st.warning(f"🔔 **Next Due:** {nd['name']} on {nd['due_date']}")

            # Filter
            filter_status = st.radio("Filter", ["All", "upcoming", "due", "overdue", "completed"], horizontal=True)

            for event in data.get("events", []):
                if filter_status != "All" and event["status"] != filter_status:
                    continue

                icon = "✅" if event["status"] == "completed" else "🗓️"
                with st.expander(f"{icon} {event['name']} — {event['due_date']} ({event['status']})"):
                    c1, c2 = st.columns(2)
                    with c1:
                        st.write(f"**Category:** {event['category']}")
                        st.write(f"**Window:** {event.get('window_start', '-')} to {event.get('window_end', '-')}")
                        if event["status"] != "completed":
                            if st.button("Mark Complete", key=f"mc_{event['id']}"):
                                requests.patch(
                                    f"{API_URL}/timeline/{st.session_state.dependent_id}/events/{event['id']}/complete",
                                    json={"completed_by": "Demo"},
                                )
                                st.rerun()
                    with c2:
                        if st.button("✨ Explain", key=f"ex_{event['id']}"):
                            ai_resp = requests.post(f"{API_URL}/ai/explain-event", json={"event_id": event["id"]})
                            if ai_resp.status_code == 200:
                                st.info(ai_resp.json().get("explanation", ""))
        else:
            st.error(f"Timeline error: {resp.text}")

# ─── TAB 2: Medicine ───
with tab2:
    c1, c2 = st.columns(2)

    with c1:
        st.subheader("📷 Image Scan")
        uploaded = st.file_uploader("Medicine Photo", type=["jpg", "png", "jpeg"])
        concern = st.text_input("Concern (e.g., pregnancy)")

        if uploaded and st.button("Scan Medicine", key="scan_img"):
            files = {"file": (uploaded.name, uploaded, uploaded.type)}
            data = {"concern": concern} if concern else {}
            resp = requests.post(f"{API_URL}/medicine/check-image", files=files, data=data)

            if resp.status_code == 200:
                r = resp.json()
                st.write(f"**Detected:** {r['detected_medicine']}")
                bucket = r["bucket"]
                if bucket == "consult_doctor_urgently":
                    st.error(f"🚨 **HIGH RISK**\n\n{r['why_caution']}\n\n**Next:** {r['next_step']}")
                elif bucket == "use_with_caution":
                    st.warning(f"⚠️ **CAUTION**\n\n{r['why_caution']}")
                elif bucket == "insufficient_info":
                    st.info(f"❓ **UNKNOWN**\n\n{r['why_caution']}")
                else:
                    st.success(f"✅ **SAFE**\n\n{r['why_caution']}")

    with c2:
        st.subheader("⌨️ Text Check")
        med_name = st.text_input("Medicine Name")
        concern_t = st.text_input("Concern", key="con_t")

        if med_name and st.button("Check Name"):
            resp = requests.post(
                f"{API_URL}/medicine/check-name", json={"medicine_name": med_name, "concern": concern_t}
            )

            if resp.status_code == 200:
                r = resp.json()
                bucket = r["bucket"]
                if bucket == "consult_doctor_urgently":
                    st.error(f"🚨 **HIGH RISK**\n\n{r['why_caution']}\n\n**Next:** {r['next_step']}")
                elif bucket == "use_with_caution":
                    st.warning(f"⚠️ **CAUTION**\n\n{r['why_caution']}")
                elif bucket == "insufficient_info":
                    st.info(f"❓ **UNKNOWN**\n\n{r['why_caution']}")
                else:
                    st.success(f"✅ **SAFE**\n\n{r['why_caution']}")

# ─── TAB 3: Voice / AI ───
with tab3:
    st.subheader("🗣️ Voice Question (via AI)")

    question = st.text_input("Ask a question about your child's health")
    language = st.selectbox("Response Language", ["en", "hi"])

    if question and st.button("Ask AI"):
        resp = requests.post(f"{API_URL}/ai/voice-question", json={"question": question, "language": language})

        if resp.status_code == 200:
            st.success(resp.json().get("answer", ""))
        else:
            st.error(f"Error: {resp.text}")

st.markdown("---")
st.caption("Powered by Streamlit + Vaxi Babu Backend")

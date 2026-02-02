import { useEffect, useRef, useState } from "react";
import "../styles/Aside.scss";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  IoPersonCircleOutline,
  IoReorderTwoSharp,
  IoChevronForward,
} from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { RiApps2AddLine } from "react-icons/ri";
import { SiSaturn } from "react-icons/si";
import { FiAlignCenter } from "react-icons/fi";
import { BsGrid1X2 } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { TbAdjustmentsFilled } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";

import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import style from "../styles/btn.module.scss";
import StarredPopup from "../components/StarredPopup";

const Asidebar = () => {
  const showBox = useSelector((state) => state.ui.showBox);
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isSpacesOpen, setIsSpacesOpen] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [role, setRole] = useState(null);

  const starredRef = useRef(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
      if (snap.exists()) setRole(snap.data().role);
    });
  }, [currentUser]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser || !role) return;
    setFilteredProjects(
      role === "admin"
        ? projects
        : projects.filter((p) =>
            p.assignedUserIds?.includes(currentUser.uid)
          )
    );
  }, [projects, role, currentUser]);

  useEffect(() => {
    if (location.pathname.startsWith("/spaces/")) setIsSpacesOpen(true);
  }, [location.pathname]);

  const asideMenu = [
    { icon: <IoPersonCircleOutline />, label: "For you", path: "/homeuser" },
    { icon: <IoMdTime />, label: "Recent", path: "/recent" },
    { icon: <IoIosStarOutline />, label: "Starred" },
    { icon: <RiApps2AddLine />, label: "Apps", path: "/apps" },
    { icon: <IoReorderTwoSharp />, label: "Plans", path: "/plans" },
    { icon: <SiSaturn />, label: "Spaces" },
    { icon: <FiAlignCenter />, label: "Filters", path: "/filters" },
    { icon: <BsGrid1X2 />, label: "Dashboards", path: "/dashboards" },
    { icon: <FaUserFriends />, label: "Teams", path: "/teams" },
    { icon: <TbAdjustmentsFilled />, label: "Customize sidebar", path: "/settings" },
  ];

  return (
    <div className={`aside-container ${showBox ? "open" : "collapsed"}`}>
      <ul className="aside-menu">
        {asideMenu.map((item, index) => {
          const isStarred = item.label === "Starred";
          const isRecent = item.label === "Recent";
          const isSpaces = item.label === "Spaces";

          return (
            <li key={index} className="aside-item">
              {isSpaces ? (
                <>
                  <div
                    className={`aside-link space-toggle ${
                      isSpacesOpen ? "open" : ""
                    }`}
                    onClick={() => setIsSpacesOpen(!isSpacesOpen)}
                  >
                    <div className={style["aside-list-items-first"]}>
                      <span className="icon-wrapper">
                        <span className="icon-normal">{item.icon}</span>
                        <span className="icon-hover">
                          <IoChevronForward />
                        </span>
                      </span>
                      <p>{item.label}</p>
                    </div>
                  </div>

                  <ul className={`aside-submenu ${isSpacesOpen ? "open" : ""}`}>
                    {filteredProjects.map((project) => (
                      <li
                        key={project.id}
                        className="aside-sub-item"
                        onClick={() =>
                          navigate(`/spaces/${project.id}`)
                        }
                      >
                        <span className="project-dot" />
                        {project.name}
                      </li>
                    ))}
                  </ul>
                </>
              ) : isStarred ? (
                <div
                  className="aside-link"
                  ref={starredRef}
                  onClick={() => setShowStarred((p) => !p)}
                >
                  <div className={style["aside-list-items-first"]}>
                    <span className="icon-wrapper">
                      <span className="icon-normal">{item.icon}</span>
                      <span className="icon-hover">
                        <IoChevronForward />
                      </span>
                    </span>
                    <p>{item.label}</p>
                  </div>

                  {/* ⭐ arrow at end */}
                  <span className="end-icon show">
                    <IoChevronForward />
                  </span>

                  {showStarred && (
                    <StarredPopup onClose={() => setShowStarred(false)} />
                  )}
                </div>
              ) : isRecent ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "aside-link active" : "aside-link"
                  }
                >
                  <div className={style["aside-list-items-first"]}>
                    <span className="icon-wrapper">
                      <span className="icon-normal">{item.icon}</span>
                      <span className="icon-hover">
                        <IoChevronForward />
                      </span>
                    </span>
                    <p>{item.label}</p>
                  </div>

                  {/* ⏱ arrow at end */}
                  <span className="end-icon show">
                    <IoChevronForward />
                  </span>
                </NavLink>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "aside-link active" : "aside-link"
                  }
                >
                  <div className={style["aside-list-items-first"]}>
                    <span className="icon-wrapper">
                      <span className="icon-normal">{item.icon}</span>
                      <span className="icon-hover">
                        <IoChevronForward />
                      </span>
                    </span>
                    <p>{item.label}</p>
                  </div>

                  {/* ⋯ three dots for others */}
                  <span className="end-icon dots">
                    <BsThreeDots />
                  </span>
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Asidebar;

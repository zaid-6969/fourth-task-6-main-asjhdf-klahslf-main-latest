import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import TextEditor from "./TextEditor";
import "../styles/app.scss";

const IssueComments = ({ issueId }) => {
  const [editorValue, setEditorValue] = useState("");
  const [comments, setComments] = useState([]);
  const auth = getAuth();

  // 🔁 Fetch comments for THIS ticket
  useEffect(() => {
    if (!issueId) return;

    const q = query(
      collection(db, "issues", issueId, "comments"),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });

    return () => unsub();
  }, [issueId]);

  // ➕ Add comment
  const handleAddComment = async () => {
    try {
      if (!auth.currentUser) {
        console.error("User not authenticated");
        return;
      }

      const isEmpty =
        !editorValue || editorValue.replace(/<(.|\n)*?>/g, "").trim() === "";

      if (isEmpty) return;

      console.log("Saving comment to issue:", issueId);

      await addDoc(collection(db, "issues", issueId, "comments"), {
        content: editorValue,
        userName:
          auth.currentUser.displayName || auth.currentUser.email || "User",
        createdAt: serverTimestamp(),
      });

      setEditorValue("");
    } catch (err) {
      console.error("Failed to save comment:", err);
    }
  };

  return (
    <div className="jira-comments">
      {/* ADD COMMENT */}
      <div className="comment-editor">
        <TextEditor value={editorValue} onChange={setEditorValue} />

        <div className="comment-actions">
          <button onClick={handleAddComment}>Add comment</button>
        </div>
      </div>

      <h4>Comments</h4>

      {/* COMMENT LIST */}
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="comment-avatar">
              {c.userName.charAt(0).toUpperCase()}
            </div>

            <div className="comment-body">
              <div className="comment-user">{c.userName}</div>

              {/* IMPORTANT: render HTML */}
              <div
                className="comment-text"
                dangerouslySetInnerHTML={{
                  __html: c.content,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueComments;

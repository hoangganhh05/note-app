function sendNote() {
  const input = document.getElementById("noteContent"); // khai báo input
  const content = input.value.trim(); // lấy nội dung từ ô input
  fetch("http://localhost:3000/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Ghi chú đã được thêm: " + JSON.stringify(data));
      input.value = ""; // Xóa input sau khi thêm
      loadNotes();
    })
    .catch((err) => {
      alert("Lỗi: " + err);
    });
}

function loadNotes() {
  fetch("/notes", { cache: "no-store" })
    .then((res) => res.json())
    .then((notes) => {
      const ul = document.getElementById("notesList");
      ul.innerHTML = "";
      notes.forEach((note) => {
        const li = document.createElement("li");
        li.textContent = `${note.content} (ID: ${note.id}) `;
        // Nút Sửa ghi chú
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Sửa";
        btnEdit.onclick = () => {
          const newContent = prompt("Nhập nội dung mới:", note.content);
          if (newContent && newContent.trim() !== "") {
            fetch(`/notes/${note.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: newContent }),
            })
              .then((res) => res.json())
              .then((data) => {
                alert(data.message);
                loadNotes();
              })
              .catch((err) => alert("Lỗi: " + err));
          }
        };
        // Nút xóa ghi chú
        const btnDel = document.createElement("button");
        btnDel.textContent = "Xóa";
        btnDel.onclick = () => {
          fetch(`/notes/${note.id}`, { method: "DELETE" })
            .then((res) => res.json())
            .then((data) => {
              alert(data.message);
              loadNotes();
            });
        };
        li.appendChild(btnEdit);
        li.appendChild(btnDel);
        ul.appendChild(li);
      });
    });
}

// Tải danh sách ghi chú khi trang web được mở
window.onload = loadNotes;

const API_URL = "../api/posts.php";

let postsData = [];

// Show Bootstrap alert
function showAlert(type, message) {
  const html = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  $("#alertBox").html(html);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Render posts table applying search & sort
function renderPosts() {
  const searchVal = $("#searchInput").val().toLowerCase();
  const sortOrder = $("#sortOrder").val();

  let filtered = postsData.filter(post =>
    post.title.toLowerCase().includes(searchVal)
  );

  filtered.sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

  if (filtered.length === 0) {
    $("#postsTable").html(
      '<tr><td colspan="4" class="text-center">No posts found</td></tr>'
    );
    return;
  }

  let html = "";
  filtered.forEach(post => {
    html += `
      <tr>
        <td>${escapeHtml(post.title)}</td>
        <td>${escapeHtml(post.body)}</td>
        <td>${post.created_at}</td>
        <td>
          <button class="btn btn-danger btn-sm deleteBtn" data-id="${post.id}">Delete</button>
        </td>
      </tr>
    `;
  });

  $("#postsTable").html(html);
}

// Load posts from API
function loadPosts() {
  $.ajax({
    url: API_URL,
    type: "GET",
    success: function (res) {
      if (res.success) {
        postsData = res.data;
        renderPosts();
      } else {
        showAlert("danger", "Failed to load posts.");
        $("#postsTable").html(
          '<tr><td colspan="4" class="text-center">No posts found</td></tr>'
        );
      }
    },
    error: function () {
      showAlert("danger", "Error fetching posts.");
    },
  });
}

$(function () {
  loadPosts();

  // Search input event
  $("#searchInput").on("input", renderPosts);

  // Sort order change event
  $("#sortOrder").on("change", renderPosts);

  // Form submit
  $("#postForm").submit(function (e) {
    e.preventDefault();

    const title = $("#title").val().trim();
    const body = $("#body").val().trim();

    // Client-side validation
    if (!title) {
      showAlert("warning", "Title is required.");
      return;
    }
    if (body.length < 10) {
      showAlert("warning", "Body must be at least 10 characters.");
      return;
    }

    $.ajax({
      url: API_URL,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ title, body }),
      success: function (res) {
        if (res.success) {
          showAlert("success", "Post created successfully!");
          $("#postForm")[0].reset();
          loadPosts();
        } else {
          showAlert("danger", res.message || "Failed to create post.");
        }
      },
      error: function () {
        showAlert("danger", "Error submitting post.");
      },
    });
  });

  // Delete post handler (event delegation)
  $(document).on("click", ".deleteBtn", function () {
    const id = $(this).data("id");
    if (!confirm("Are you sure you want to delete this post?")) return;

    $.ajax({
      url: API_URL + "?id=" + id,
      type: "DELETE",
      success: function (res) {
        if (res.success) {
          showAlert("success", "Post deleted successfully!");
          loadPosts();
        } else {
          showAlert("danger", res.message || "Failed to delete post.");
        }
      },
      error: function () {
        showAlert("danger", "Error deleting post.");
      },
    });
  });
});

const API_URL = "../api/posts.php";

$(document).ready(function () {
  // Load posts on page load
  function loadPosts() {
    $.ajax({
      url: API_URL,
      type: "GET",
      success: function (res) {
        if (res.success) {
          let html = "";
          res.data.forEach(post => {
            html += `
              <tr>
                <td>${post.title}</td>
                <td>${post.body}</td>
                <td>${post.created_at}</td>
                <td><button class="btn btn-danger btn-sm deleteBtn" data-id="${post.id}">Delete</button></td>
              </tr>
            `;
          });
          $("#postsTable").html(html);
        } else {
          $("#postsTable").html('<tr><td colspan="4">No posts found</td></tr>');
        }
      },
      error: function () {
        alert("Failed to load posts.");
      }
    });
  }

  loadPosts();

  // Handle form submit to create post
  $("#postForm").submit(function (e) {
    e.preventDefault();

    const postData = {
      title: $("#title").val().trim(),
      body: $("#body").val().trim()
    };

    $.ajax({
      url: API_URL,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(postData),
      success: function (res) {
        if (res.success) {
          alert("Post created successfully!");
          $("#postForm")[0].reset();
          loadPosts();
        } else {
          alert(res.message || "Failed to create post");
        }
      },
      error: function () {
        alert("Error submitting post.");
      }
    });
  });

  // Handle delete button click (using event delegation)
  $(document).on("click", ".deleteBtn", function () {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const id = $(this).data("id");

    $.ajax({
      url: API_URL + "?id=" + id,
      type: "DELETE",
      success: function (res) {
        if (res.success) {
          alert("Post deleted successfully!");
          loadPosts();
        } else {
          alert(res.message || "Failed to delete post");
        }
      },
      error: function () {
        alert("Error deleting post.");
      }
    });
  });
});

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blog Dashboard</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="container my-5">

    <h2 class="text-center mb-4">📘 Blog Dashboard</h2>

    <!-- Alerts -->
    <div id="alertBox"></div>

    <!-- Create Post -->
    <div class="card mb-4">
        <div class="card-header fw-bold">Create New Post</div>
        <div class="card-body">
            <form id="postForm">
                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" id="title" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Body</label>
                    <textarea id="body" class="form-control" rows="4" required></textarea>
                </div>

                <button class="btn btn-primary">Add Post</button>
            </form>
        </div>
    </div>

    <!-- Posts -->
    <div class="card">
        <div class="card-header fw-bold">All Posts</div>
        <div class="card-body table-responsive">
            <table class="table table-bordered align-middle">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Body</th>
                        <th>Created</th>
                        <th width="120">Action</th>
                    </tr>
                </thead>
                <tbody id="postsTable"></tbody>
            </table>
        </div>
    </div>

</div>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Bootstrap -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script src="assets/js/app.js"></script>
</body>
</html>

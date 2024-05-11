window.onload = function() {
    // Fetch the posts from the server
    fetch('posts/postsjson/01post.json')
    .then(response => response.json())
    .then(posts => {
        // Get the container for the posts
        const postsContainer = document.getElementById('posts');

        // Loop through the posts
        posts.forEach(post => {
            // Create a div for the post
            const postDiv = document.createElement('div');

            // Create an h2 for the post title
            const title = document.createElement('h2');
            title.textContent = post.title;
            title.className = 'post-title';  // Add a class
            postDiv.appendChild(title);

            // Create a p for the post content
            const content = document.createElement('p');
            content.innerHTML = post.content.replace(/\\n/g, '<br>');  // Replace \n with <br>
            content.className = 'post-content';  // Add a class
            postDiv.appendChild(content);

            // Create a p for the post date
            const date = document.createElement('p');
            date.textContent = post.date;
            date.className = 'post-date';  // Add a class
            postDiv.appendChild(date);

            // Create a p for the post author
            const author = document.createElement('p');
            author.textContent = post.author;
            author.className = 'post-details';  // Add a class
            postDiv.appendChild(author);

            // Create a p for the seperator
            const separator = document.createElement('p');
            separator.textContent = post.separator;
            separator.className = 'post-separator';  // Add a class
            postDiv.appendChild(separator);

            // Add the post div to the posts container
            postsContainer.appendChild(postDiv);
        });
    })
    .catch(error => console.error('Error:', error));
}
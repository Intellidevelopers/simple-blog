const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Path to the file where posts will be stored
const postsFilePath = 'posts.json';

// Load existing posts from the file
let posts = [];

try {
    const data = fs.readFileSync(postsFilePath, 'utf-8');
    posts = JSON.parse(data);
} catch (error) {
    console.error('Error reading posts file:', error);
}

// Add a unique ID to each post for easy identification
posts.forEach((post, index) => post.id = index + 1);

app.post('/admin/post', (req, res) => {
    const { title, description, image } = req.body;

    const post = { id: posts.length + 1, title, description, image };
    posts.push(post);

    fs.writeFile(postsFilePath, JSON.stringify(posts), (err) => {
        if (err) {
            console.error('Error writing posts file:', err);
        }
    });

    res.redirect('/admin.html');
});

app.get('/server.js/posts', (req, res) => {
    res.json(posts);
});

app.put('/server.js/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, description, image } = req.body;

    const postToUpdate = posts.find(post => post.id === postId);

    if (postToUpdate) {
        postToUpdate.title = title;
        postToUpdate.description = description;
        postToUpdate.image = image;

        fs.writeFile(postsFilePath, JSON.stringify(posts), (err) => {
            if (err) {
                console.error('Error writing posts file:', err);
            }
        });

        res.json({ message: 'Post updated successfully' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

app.delete('/server.js/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);

    const updatedPosts = posts.filter(post => post.id !== postId);

    if (updatedPosts.length < posts.length) {
        fs.writeFile(postsFilePath, JSON.stringify(updatedPosts), (err) => {
            if (err) {
                console.error('Error writing posts file:', err);
            }
        });

        res.json({ message: 'Post deleted successfully' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

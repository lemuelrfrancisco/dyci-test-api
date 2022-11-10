const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    user: req.userData.userId,
    latitude: req.body.latitude ? req.body.latitude : '',
    longitude: req.body.longitude ? req.body.longitude : '',
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'Creating a post failed!',
        error,
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    // Post.updateOne({ _id: req.params.id }, post)

    .then((result) => {
      console.log(result);
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Update successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't udpate post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find().populate('user');
  // .aggregate([
  //   {
  //     $lookup: {
  //       from: 'users',
  //       localField: 'creator',
  //       foreignField: '_id',
  //       as: 'userInfo',
  //     },
  //   },
  // ]);
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'Fetching posts failed!',
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('user')
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'Fetching post failed!',
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    // Post.deleteOne({ _id: req.params.id })

    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Deletion successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Deleting posts failed!',
      });
    });
};

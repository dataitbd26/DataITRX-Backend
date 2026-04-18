import News from "./News.model.js";

export async function getAllNews(req, res) {
  try {
    const result = await News.find().sort({ date: -1 }); // Added sorting to show newest first
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// --- Add this new function ---
export async function getNewsByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const result = await News.find({ branch }).sort({ date: -1 });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
// -----------------------------

export async function getNewsById(req, res) {
  const id = req.params.id;
  try {
    const result = await News.findById(id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createNews(req, res) {
  try {
    const newsData = req.body;
    const result = await News.create(newsData);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateNews(req, res) {
  const id = req.params.id;
  const newsData = req.body;
  try {
    const result = await News.findByIdAndUpdate(id, newsData, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeNews(req, res) {
  const id = req.params.id;
  try {
    const result = await News.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "News deleted successfully" });
    } else {
      res.status(404).json({ message: "News not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
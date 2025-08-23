const Banner = require('../models/Banner');

// GET /api/banners
exports.getAllBanners = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const banners = await Banner.find(filter).sort('order');
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};


// POST /api/banners
exports.createBanner = async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create banner' });
  }
};

// PUT /api/banners/:id
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(banner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update banner' });
  }
};

// DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete banner' });
  }
};
// GET /api/banners/:id
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json(banner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch banner' });
  }
};
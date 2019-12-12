class AssetsLoader {
  constructor() {
    this.assets = {};
  }

  load(assets, callback) {
    const toLoad = assets.length;
    let loaded = 0;

    assets.forEach((a) => {
      const img = new Image();

      img.onload = () => {
        this.assets[a.id] = img;
        loaded = loaded + 1;
        if (loaded === toLoad) {
          callback(this.assets);
        }
      };

      img.src = a.url;
    });

    return callback;
  }

  get(id) {
    return this.assets[id];
  }

  unload(id) {
    delete this.assets[id];
  }
}

module.exports = new AssetsLoader();

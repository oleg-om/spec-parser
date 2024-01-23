import ProgressBar from "progress";
import Fs from "fs";
import Path from "path";
import Axios from "axios";

export const transformId = (obj) => {
  if (obj?.code1c) {
    const newObj = { ...obj };
    delete newObj.code1c;
    return { ...newObj, uuid: obj.code1c };
  } else {
    return obj;
  }
};

export const transformImages = (obj) => {
  const modifyUrl = (url) => url.replace("//", "https://").replace("?iv=5", "");
  if (obj?.image?.presets?.default && obj?.image?.presets?.preview) {
    const newObj = { ...obj };
    return {
      ...newObj,
      image: {
        ...newObj.image,
        presets: {
          ...newObj.image.presets,
          default: modifyUrl(newObj.image.presets.default),
          preview: modifyUrl(newObj.image.presets.preview),
        },
      },
    };
  } else {
    return obj;
  }
};

export const showProgress = (itemsLength, message) => {
  const bar = new ProgressBar(`-> ${message} [:bar] :percent :etas`, {
    total: itemsLength,
    width: 30,
  });

  return { bar };
};

export async function downloadImage(url, file) {
  const path = Path.resolve( "images", file);
  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

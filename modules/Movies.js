const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const https = require("https");

const index = async (req) => {
  const items = await prisma.movie.findMany();
  return items;
};

const detail = async (req) => {
  const { id } = req.params;
  const item = await prisma.movie.findFirstOrThrow({
    where: { id }
  });
  if (item) {
    return item;
  }
  return false;
};

const update = async (req) => {
  const { id } = req.params;
  const body = req.body;

  const item = await prisma.movie.findFirstOrThrow({
    where: { id }
  });
  if (item) {
    let subtitle = item.subtitle;
    for (const file of req.files) {
      const vtt = srtToVtt(file.buffer.toString());
      try {
        fs.appendFile("public/uploads/" + body.title + ".vtt", vtt, function(err) {
          if (err) throw err;
        });
        subtitle = "/uploads/" + body.title + ".vtt";
      } catch (err) {
        console.error(err);
      }
    }
    const new_item = await prisma.movie.update({
      where: { id },
      data: {
        title: body.title,
        movie_url: body.movie_url,
        subtitle: subtitle
      }
    });
  }
  return false;
};

const create = async (req) => {
  const body = req.body;
  let subtitle = "";
  let movie_url = "";
  for (const file of req.files) {
    const vtt = srtToVtt(file.buffer.toString());
    try {
      await fs.appendFile("public/uploads/" + body.title + ".vtt", vtt, function(err) {
        if (err) throw err;
      });
      subtitle = "/uploads/" + body.title + ".vtt";
    } catch (err) {
      console.error(err);
    }
  }
  const filename = body.movie_url.substring(body.movie_url.lastIndexOf("/") + 1);
  const fileFormat = filename.substring(filename.lastIndexOf(".") + 1);
  await downloadFile(body.movie_url, "public/uploads/" + body.title + "." + fileFormat);
  movie_url = "/uploads/" + body.title + "." + fileFormat;
  const items = await prisma.movie.create({
    data: {
      title: body.title,
      movie_url: movie_url,
      subtitle: subtitle
    }
  });
  return items;
};

const remove = async (req) => {
  const { id } = req.params;
  const item = await prisma.movie.delete({
    where: { id }
  });

  fs.unlink("public" + item.subtitle, (err) => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("File is deleted.");
    }
  });

  fs.unlink("public" + item.movie_url, (err) => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("File is deleted.");
    }
  });
  return true;
};

module.exports = { index, create, detail, update, remove };

const srtToVtt = (srtText) => {
  const blocks = srtText.trim().split(/\r?\n\s*\r?\n/);

  const vttContent = blocks.map((block, index) => {
    const [sequence, timing, text] = block.split(/\r?\n/);
    const [startTime, endTime] = timing.split(" --> ");

    const convertedStartTime = startTime.replace(",", ".");
    const convertedEndTime = endTime.replace(",", ".");

    return `${convertedStartTime} --> ${convertedEndTime}\n${text}\n\n`;
  }).join("");

  return "WEBVTT\n\n".concat(vttContent);
};

const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https.get(url, response => {
      response.pipe(file);

      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", error => {
      fs.unlink(filePath, () => reject(error));
    });
  });
};
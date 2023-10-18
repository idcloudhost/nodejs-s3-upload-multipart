import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
  endpoint: process.env.AWS_BASE_URL,
  region: "",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// const filename = "assets/test.img";
const filename = "assets/movie.mp4";
const fileContent = fs.readFileSync(filename);

const params = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: `${filename}`,
  Body: fileContent,
};

/**
 * Uploading a file with concurrency of 4 and partSize of 8mb
 */
const options = { partSize: 8 * 1024 * 1024, queueSize: 4 };

try {
  await s3
    .upload(params, options)
    .on("httpUploadProgress", function (obj) {
      console.log(
        "Uploaded :: " + parseInt((obj.loaded * 100) / obj.total) + "%"
      );
    })
    .promise();
  console.log("upload OK", filename);
} catch (error) {
  console.log("upload ERROR", filename, error);
}

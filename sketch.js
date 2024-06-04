/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, bodypose, pose, keypoint, detector;
let poses = []; // 用於存儲檢測到的姿勢數據的數組

// 初始化MoveNet檢測器的異步函數
async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING, // 設置MoveNet的模型類型為MULTIPOSE_LIGHTNING
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  ); // 創建MoveNet檢測器
}

// 當視頻準備好時調用的異步函數
async function videoReady() {
  console.log("video ready");
  await getPoses(); // 開始獲取姿勢
}

// 獲取姿勢的異步函數
async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2, // 最多檢測兩個姿勢
      //flipHorizontal: true, // 如果需要水平翻轉可以取消註解
    });
  }
  requestAnimationFrame(getPoses); // 遞歸調用，以實時獲取姿勢
}

// 設置畫布和視頻捕捉的異步函數
async function setup() {
  createCanvas(640, 480); 
  video = createCapture(VIDEO, videoReady); // 捕捉視頻並在視頻準備好時調用videoReady
  video.size(width, height); 
  video.hide(); // 隱藏視頻元素，僅在畫布上顯示
  await init(); // 初始化MoveNet檢測器

  stroke(255); 
  strokeWeight(5);
}

// 繪製每一幀畫面的函數
function draw() {
  image(video, 0, 0); 
  push(); 
  drawSkeleton(); // 繪製骨架
  pop(); 

  // 水平翻轉畫面
  cam = get(); // 獲取當前畫布
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0); // 繪製翻轉後的畫布
}

// 繪製骨架的函數
function drawSkeleton() {
  // 繪製所有追蹤到的關鍵點
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];
    // 文字
    partA = pose.keypoints[0];
    if (partA.score > 0.1) { // 只有當檢測到的關鍵點可信度大於0.1時才繪製
      push(); 
      textSize(40); 
      scale(-1, 1); // 水平翻轉文字
      textAlign(CENTER); // 設置文字對齊為中心
      text("412730789葉亭儀", -partA.x, partA.y - 120); // 在頭頂正上方繪製文字
      pop(); 
    }
    // 眼睛
    partA = pose.keypoints[1]; // 左眼
    partB = pose.keypoints[2]; // 右眼
    if (partA.score > 0.1 && partB.score > 0.1) { // 檢測到兩個眼睛的可信度大於0.1時繪製
      push(); 
      imageMode(CENTER); 
      image(GIFImg, partA.x, partA.y, 50, 50); // 在左眼位置繪製GIF圖片
      image(GIFImg, partB.x, partB.y, 50, 50); // 在右眼位置繪製GIF圖片
      pop(); 
    }
    // 手腕
    partA = pose.keypoints[9]; // 左手腕
    partB = pose.keypoints[10]; // 右手腕
    if (partA.score > 0.1 && partB.score > 0.1) { // 檢測到兩個手肘的可信度大於0.1時繪製
      push(); 
      imageMode(CENTER); 
      image(GIFImg, partA.x, partA.y, 50, 50); // 在左手腕位置繪製GIF圖片
      image(GIFImg, partB.x, partB.y, 50, 50); // 在右手腕位置繪製GIF圖片
      pop(); 
    }
  }
}

// 預加載圖像的函數
function preload() {
  GIFImg = loadImage("dog.gif"); // 加載GIF圖片
}
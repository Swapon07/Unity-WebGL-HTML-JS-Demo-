var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");

function unityShowBanner(msg, type) {
  function updateBannerVisibility() {
    warningBanner.style.display = warningBanner.children.length
      ? "block"
      : "none";
  }
  var div = document.createElement("div");
  div.innerHTML = msg;
  warningBanner.appendChild(div);
  if (type == "error") div.style = "background: red; padding: 10px;";
  else {
    if (type == "warning") div.style = "background: yellow; padding: 10px;";
    setTimeout(function () {
      warningBanner.removeChild(div);
      updateBannerVisibility();
    }, 5000);
  }
  updateBannerVisibility();
}

var buildUrl = "assets";
var loaderUrl = buildUrl + "/Build/assets.loader.js";
var config = {
  dataUrl: buildUrl + "/Build/assets.data",
  frameworkUrl: buildUrl + "/Build/assets.framework.js",
  codeUrl: buildUrl + "/Build/assets.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "WebGL",
  productVersion: "0.1",
  showBanner: unityShowBanner,
};

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  // Mobile device style: fill the whole browser client area with the game canvas:

  var meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content =
    "width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes";
  document.getElementsByTagName("head")[0].appendChild(meta);
  container.className = "unity-mobile";
  canvas.className = "unity-mobile";

  // To lower canvas resolution on mobile devices to gain some
  // performance, uncomment the following line:
  // config.devicePixelRatio = 1;
} else {
  // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

  canvas.style.width = "800px";
  canvas.style.height = "450px";
}

loadingBar.style.display = "block";

var unityInstance; // Declare unityInstance globally
var isCompaire = false;
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(canvas, config, (progress) => {
    progressBarFull.style.width = 100 * progress + "%";
  })
    .then((instance) => {
      // Unity instance created successfully
      unityInstance = instance; // Assign unityInstance globally
      loadingBar.style.display = "none"; // Hide the loading bar
      // Setup any additional functionality or event handlers here
      fullscreenButton.onclick = () => {
        unityInstance.SetFullscreen(1); // Set Unity content to fullscreen mode
      };
    })
    .catch((message) => {
      // Handle any errors that occur during instance creation
      alert(message);
    });
};

// Append the script element to the document to load the Unity loader script
document.body.appendChild(script);

// Hand the quantity btn
function incrementQuantity() {
  var quantityInput = document.getElementById("quantity");
  var currentValue = parseInt(quantityInput.value);
  quantityInput.value = currentValue + 1;
  updatePrice();
}

function decrementQuantity() {
  var quantityInput = document.getElementById("quantity");
  var currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
    updatePrice();
  }
}

function updatePrice() {
  var quantityInput = document.getElementById("quantity");
  var totalPrice = document.getElementById("totalPrice");
  var currentValue = parseInt(quantityInput.value);
  var unitPrice = 264950;
  var totalPriceValue = currentValue * unitPrice;
  totalPrice.textContent =
    "BDT " + totalPriceValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

const modelViewerColor = document.querySelector("model-viewer#color");

document.querySelector("#color-controls").addEventListener("click", (event) => {
  const colorHex = event.target.dataset.color;
  if (isCompaire) return;
  switch (colorHex) {
    case "#ff0000":
      unityInstance.SendMessage("m_controller", "ChangeModelColor", 0);
      break;
    case "#0000ff":
      unityInstance.SendMessage("m_controller", "ChangeModelColor", 1);
      break;
    case "#00ff00":
      unityInstance.SendMessage("m_controller", "ChangeModelColor", 2);
      console.log("Set Camera Pose");
      break;
    default:
      unityInstance.SendMessage("m_controller", "ChangeModelColor", 0);
      break;
  }
});

const hexToRgb = (hex) => {
  // Remove the # if its ---
  hex = hex.replace("#", "");

  // Parse the hex values to decimal
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return [r, g, b];
};

function ActiveCompareMode() {
  isCompaire = !isCompaire;
  unityInstance.SendMessage("Main Camera", "MoveComparePosition");

  var compareButton = document.getElementById("compareButton");
  if (isCompaire) {
    compareButton.textContent = "Stop Compare";
  } else {
    compareButton.textContent = "Compare";
  }
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function displayImage(imageId) {
  if (!unityInstance) {
    console.error("API object is not available.");
    return;
  }

  if (isCompaire) return;
  switch (imageId) {
    case "moduleViewer":
      unityInstance.SendMessage("Main Camera", "MoveToTargetPosition", 0);
      break;
    case "image2":
      unityInstance.SendMessage("Main Camera", "MoveToTargetPosition", 1);
      break;
    case "image3":
      unityInstance.SendMessage("Main Camera", "MoveToTargetPosition", 2);
      console.log("Set Camera Pose");
      break;
    default:
      unityInstance.SendMessage("Main Camera", "MoveToTargetPosition", 0);
      break;
  }

  // Set camera position and target
  // api.setCameraLookAt(cameraPosition1, targetPosition1);
}

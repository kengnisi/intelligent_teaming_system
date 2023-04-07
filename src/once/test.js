var sentenceA = "这只皮靴号码大了，那只号码合适。";
var sentenceB = "这只皮靴号码不小，那只更合适。";

// 计算余弦相似度
function cosineSimilarity(sentenceA, sentenceB) {
  var aWords = sentenceA.split('');
  var bWords = sentenceB.split('');
  var aLength = aWords.length;
  var bLength = bWords.length;
  var aCount = {};
  var bCount = {};

  // 计算出每个单词的词频
  for (var i = 0; i < aLength; i++) {
    if (aCount[aWords[i]] === undefined) {
      aCount[aWords[i]] = 1;
    } else {
      aCount[aWords[i]]++;
    }
  }
  for (var j = 0; j < bLength; j++) {
    if (bCount[bWords[j]] === undefined) {
      bCount[bWords[j]] = 1;
    } else {
      bCount[bWords[j]]++;
    }
  }

  // 计算词频的点积
  var dotProduct = 0;
  for (var k in aCount) {
    if (bCount[k] !== undefined) {
      dotProduct += aCount[k] * bCount[k];
    }
  }

  // 计算词频的模长
  var aLengthSquare = 0;
  for (var key in aCount) {
    aLengthSquare += aCount[key] * aCount[key];
  }
  aLengthSquare = Math.sqrt(aLengthSquare);

  var bLengthSquare = 0;
  for (var key in bCount) {
    bLengthSquare += bCount[key] * bCount[key];
  }
  bLengthSquare = Math.sqrt(bLengthSquare);
  // 计算余弦相似度
  var cosineSimilarity = dotProduct / (aLengthSquare * bLengthSquare);

  return cosineSimilarity;
}

console.log(cosineSimilarity("广州求职", "前端求职拼车")); // 0.8396432548525454
import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/songs.csv"
const trainingLabel = "Audio_class"
const ignored = ['Participant_ID', 'Spotify_ID', 'Audio + Lyrics analysis', 'Total_mental_health', 'Mental_health_severity_class']

//
// Variables
//
const accuracyHTML = document.getElementById('accuracy');
let decisionTree
let amountCorrect = 0
let totalAmount
let accuracy;
let confusionMatrix = {
    Sad: {
        Sad: 0,
        Happy: 0,
        Relax: 0,
        Tense: 0
    },
    Happy: {
        Sad: 0,
        Happy: 0,
        Relax: 0,
        Tense: 0
    },
    Relax: {
        Sad: 0,
        Happy: 0,
        Relax: 0,
        Tense: 0
    },
    Tense: {
        Sad: 0,
        Happy: 0,
        Relax: 0,
        Tense: 0
    }
}

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    //Shuffle array
    data.sort(() => (Math.random() - 0.5));

    // todo : splits data in traindata en testdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)
    totalAmount = testData.length

    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 6
    })

    let json = decisionTree.toJSON()
    let jsonString = JSON.stringify(json)
    //console.log(jsonString);

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 1600, 400, json)

    // TODO : bereken de accuracy met behulp van alle test data

    //For each testdata test een keer
    for (let test of testData) {
        //console.log(test)
        testSong(test)
    }
}

function testSong(song) {
    // kopie van song maken, zonder het label
    const songWithoutLabel = Object.assign({}, song)
    delete songWithoutLabel.Audio_class

    // prediction
    let prediction = decisionTree.predict(songWithoutLabel)

    // vergelijk de prediction met het echte label
    if (prediction == song.Audio_class) {
        //console.log(prediction);
        console.log("Deze voorspelling is goed gegaan!")
        amountCorrect++
        accuracy = Math.round(amountCorrect / totalAmount * 100)
        accuracyHTML.innerText = `Accuracy : ${accuracy}%`

    } else {
        console.log("Deze voorspelling is niet goed!")
    }

    confusionMatrix[prediction][song.Audio_class]++;
    console.log(confusionMatrix)
    confusion();
}

function confusion() {
    const id_1 = document.getElementById('1')
    const id_2 = document.getElementById('2')
    const id_3 = document.getElementById('3')
    const id_4 = document.getElementById('4')
    const id_5 = document.getElementById('5')
    const id_6 = document.getElementById('6')
    const id_7 = document.getElementById('7')
    const id_8 = document.getElementById('8')
    const id_9 = document.getElementById('9')
    const id_10 = document.getElementById('10')
    const id_11 = document.getElementById('11')
    const id_12 = document.getElementById('12')
    const id_13 = document.getElementById('13')
    const id_14 = document.getElementById('14')
    const id_15 = document.getElementById('15')
    const id_16 = document.getElementById('16')

    id_1.innerText = confusionMatrix.Sad.Sad;
    id_2.innerText = confusionMatrix.Sad.Happy;
    id_3.innerText = confusionMatrix.Sad.Relax;
    id_4.innerText = confusionMatrix.Sad.Tense;
    id_5.innerText = confusionMatrix.Happy.Sad;
    id_6.innerText = confusionMatrix.Happy.Happy;
    id_7.innerText = confusionMatrix.Happy.Relax;
    id_8.innerText = confusionMatrix.Happy.Tense;
    id_9.innerText = confusionMatrix.Relax.Sad;
    id_10.innerText = confusionMatrix.Relax.Happy;
    id_11.innerText = confusionMatrix.Relax.Relax;
    id_12.innerText = confusionMatrix.Relax.Tense;
    id_13.innerText = confusionMatrix.Tense.Sad;
    id_14.innerText = confusionMatrix.Tense.Happy;
    id_15.innerText = confusionMatrix.Tense.Relax;
    id_16.innerText = confusionMatrix.Tense.Tense;

}

loadData()
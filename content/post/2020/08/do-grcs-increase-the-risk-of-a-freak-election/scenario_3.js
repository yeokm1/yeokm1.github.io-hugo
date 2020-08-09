scenario_3 = function () {

    var barChart;
    var pieChart;

    var altShareOriginal = [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]
    var voteShiftPerCycle = 0.1
    var voteShift = 0
    var maxVoteShift = 90

    var altShareToUse = []
    var randomFloor = 12.5
    var randomCeiling = 49.9

    var SimulationModes = { Reset: 1, Paused: 2, InProgress: 3 }

    var simulationMode = SimulationModes.Reset

    var simulationButton;
    var incrementSlider;

    function drawChart(altShare, altShareGRC, tableID, pieID, barChartTitle) {

        var incumbentColour = "#CD5C5C"
        var alternativeColour = "#2622C9"

        var incShare = []

        for (i = 0; i < altShare.length; i++) {
            incShare.push(100 - altShare[i])
        }

        var ctx1 = document.getElementById(tableID);

        if (barChart == null) {
            barChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ["A-SMC1", "A-SMC2", "A-SMC3", "A-SMC4", "A-SMC5", "B-SMC6", "B-SMC7", "B-SMC8", "B-SMC9", "B-SMC10", "C-SMC11", "C-SMC12", "C-SMC13", "C-SMC14", "C-SMC15"],
                    datasets: [
                        {
                            label: "Alternative",
                            backgroundColor: alternativeColour,
                            data: altShare,
                            order: 2
                        },
                        {
                            label: "Incumbent",
                            backgroundColor: incumbentColour,
                            data: incShare,
                            order: 3
                        },
                    ]
                },
                options: {
                    legend: { display: true },
                    title: {
                        display: true,
                        text: barChartTitle
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            stacked: true,
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    },
                    annotation: {
                        annotations: [{
                            type: 'line',
                            drawTime: 'afterDatasetsDraw',
                            scaleID: 'y-axis-0',
                            mode: 'horizontal',
                            value: 50,
                            borderColor: "#000000"
                        }]
                    }

                },


            });

        } else {
            barChart.data.datasets[0].data = altShare
            barChart.data.datasets[1].data = incShare
            barChart.options.title.text = barChartTitle
            barChart.update()
        }


        var parliamentaryPercentageData = produceParliamentarySeatShare(altShareGRC)

        var piedata = {
            datasets: [{
                data: parliamentaryPercentageData,
                backgroundColor: [
                    alternativeColour,
                    incumbentColour
                ],

            }],

            labels: [
                'Alternative (' + parliamentaryPercentageData[0] + ")",
                'Incumbent (' + parliamentaryPercentageData[1] + ")"
            ]
        };

        var ctx2 = document.getElementById(pieID);

        if (pieChart == null) {
            pieChart = new Chart(ctx2, {
                type: 'pie',
                data: piedata,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Parliamentary Seats Obtained'
                    }
                },
            });
        } else {
            pieChart.data.datasets[0].data = parliamentaryPercentageData
            pieChart.data.labels[0] = 'Alternative (' + parliamentaryPercentageData[0] + ")"
            pieChart.data.labels[1] = 'Incumbent (' + parliamentaryPercentageData[1] + ")"

            pieChart.update()
        }


        var tableData = document.getElementById("scenario_3-table")

        // GRC A
        tableData.rows[1].cells[1].innerHTML = ((incShare[0] + incShare[1] + incShare[2] + incShare[3] + incShare[4]) / 5).toFixed(1) + "%"
        tableData.rows[1].cells[2].innerHTML = ((altShare[0] + altShare[1] + altShare[2] + altShare[3] + altShare[4]) / 5).toFixed(1) + "%"

        // GRC B
        tableData.rows[2].cells[1].innerHTML = ((incShare[5] + incShare[6] + incShare[7] + incShare[8] + incShare[9]) / 5).toFixed(1) + "%"
        tableData.rows[2].cells[2].innerHTML = ((altShare[5] + altShare[6] + altShare[7] + altShare[8] + altShare[9]) / 5).toFixed(1) + "%"

        // GRC C
        tableData.rows[3].cells[1].innerHTML = ((incShare[10] + incShare[11] + incShare[12] + incShare[13] + incShare[14]) / 5).toFixed(1) + "%"
        tableData.rows[3].cells[2].innerHTML = ((altShare[10] + altShare[11] + altShare[12] + altShare[13] + altShare[14]) / 5).toFixed(1) + "%"

        incumbentSeatSharePercent = ((parliamentaryPercentageData[1] / (parliamentaryPercentageData[0] + parliamentaryPercentageData[1])) * 100).toFixed(1)
        alternativeSeatSharePercent = ((parliamentaryPercentageData[0] / (parliamentaryPercentageData[0] + parliamentaryPercentageData[1])) * 100).toFixed(1)


        //Incumbent seat share
        tableData.rows[4].cells[1].innerHTML = incumbentSeatSharePercent + "%"

        //Alternative seat share
        tableData.rows[4].cells[2].innerHTML = alternativeSeatSharePercent + "%"

        var altShareTotal = 0
        var incShareTotal = 0

        for (i = 0; i < altShare.length; i++) {
            altShareTotal += altShare[i]
            incShareTotal += incShare[i]
        }

        //Incumbent popular vote %
        tableData.rows[5].cells[1].innerHTML = (incShareTotal / altShare.length).toFixed(1) + "%"

        //Alternative popular vote %
        tableData.rows[5].cells[2].innerHTML = (altShareTotal / altShare.length).toFixed(1) + "%"

        //Popular Vote Swing
        tableData.rows[5].cells[0].innerHTML = "Popular Vote (Swing " + voteShift.toFixed(1) + "%)"

    }

    //Array of GRCs
    //Each GRC is an array of SMCs 
    function produceParliamentarySeatShare(altShareTable) {

        var altSeatsWon = 0;
        var rulSeatsWon = 0


        for (i = 0; i < altShareTable.length; i++) {
            currentGRC = altShareTable[i]

            var altVote = 0

            for(j = 0; j < currentGRC.length; j++){
                altVote += currentGRC[j]
            }

            altVote /= currentGRC.length

            if(altVote >= 50){
                altSeatsWon += currentGRC.length
            } else {
                rulSeatsWon += currentGRC.length
            }


        }

        result = [altSeatsWon, rulSeatsWon]

        return result

    }

    function startTimeOut() {
        setTimeout(onTimeout, 100)
    }

    function updateSimulationButtonText() {
        switch (simulationMode) {
            case SimulationModes.Reset:
                simulationButton.innerText = "Start Simulation"
                break;
            case SimulationModes.Paused:
                simulationButton.innerText = "Resume Simulation"
                break;
            case SimulationModes.InProgress:
                simulationButton.innerText = "Pause Simulation"
                break
            default:
        }
    }


    function simulationButtonPressed() {
        switch (simulationMode) {
            case SimulationModes.Reset:
            case SimulationModes.Paused:
                simulationMode = SimulationModes.InProgress
                updateSimulationButtonText()
                startTimeOut()
                break
            case SimulationModes.InProgress:
                simulationMode = SimulationModes.Paused
                updateSimulationButtonText()
                break
            default:
        }
    }

    function resetButtonPressed() {
        voteShift = 0;
        incrementSlider.value = voteShift
        resetAltShareToUse()
        simulationMode = SimulationModes.Reset
        updateSimulationButtonText()
        updateChart()
    }

    function randomiseButtonPressed(){

        if(simulationMode == SimulationModes.Reset){
            voteShift = 0;
            incrementSlider.value = voteShift

            altShareToUse = []
            for (i = 0; i < altShareOriginal.length; i++) {
                altShareValue = generateRandomFloat(randomFloor, randomCeiling)
                altShareToUse.push(altShareValue)
            }

            updateSimulationButtonText()
            updateChart()
        }
    }

    function generateRandomFloat(floor, ceiling){
        return (Math.random() * (ceiling - floor) + floor)
    }

    function resetAltShareToUse(){
        altShareToUse = []
        for (i = 0; i < altShareOriginal.length; i++) {
            altShareValue = altShareOriginal[i]
            altShareToUse.push(altShareValue)
        }
    }

    function sliderChanged() {
        voteShift = parseFloat(incrementSlider.value)
        updateChart()
    }

    function onTimeout() {

        if (voteShift < maxVoteShift) {
            voteShift = voteShift + voteShiftPerCycle
            incrementSlider.value = voteShift
            updateChart()
        }
    }

    function updateChart() {
        var altShareAfterCycle = []

        for (i = 0; i < altShareToUse.length; i++) {
            altShareValue = altShareToUse[i] + voteShift
            if (altShareValue > 100) {
                altShareValue = 100
            }
            altShareAfterCycle.push(altShareValue)
        }

        altShareGRC = [altShareAfterCycle.slice(0,5), altShareAfterCycle.slice(5,10), altShareAfterCycle.slice(10,15)]

        drawChart(altShareAfterCycle, altShareGRC, "scenario_3-bar", "scenario_3-pie", "Vote breakdown of individual SMCs")

        parliamentaryShare = produceParliamentarySeatShare(altShareGRC)

        if (parliamentaryShare[0] > parliamentaryShare[1]) {
            simulationMode = SimulationModes.Paused
            updateSimulationButtonText()
            return
        }

        if (simulationMode == SimulationModes.InProgress) {
            startTimeOut()
        }

    }

    document.addEventListener("DOMContentLoaded", function (event) {

        simulationButton = document.getElementById("scenario_3-simulation-button")

        simulationButton.addEventListener('click', simulationButtonPressed);

        document.getElementById("scenario_3-reset-button").addEventListener('click', resetButtonPressed);

        document.getElementById("scenario_3-randomise-button").addEventListener('click', randomiseButtonPressed);

        incrementSlider = document.getElementById("scenario_3-slider")

        incrementSlider.addEventListener('input', sliderChanged)
    });


    resetAltShareToUse()

    updateChart()

}

scenario_3();



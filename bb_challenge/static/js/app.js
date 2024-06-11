//Simplifying the url json
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
console.log(url);







// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    console.log(data);
        // get the metadata field
    let metadata = data.metadata;
    console.log(metadata);
    // Filter the metadata for the object with the desired sample number
    let results = metadata.filter(searched => searched.id == sample)[0];
    console.log("Metadata Result: ", results);
    
    // Use d3 to select the panel with id of `#sample-metadata`
     let indexPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
     indexPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(results).forEach(([key, value]) => {
      indexPanel.append("h6").text(`${key}: ${value}`);
    });
    // return metadata;
  });
};







// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let results = samples.filter(searched => searched.id == sample)[0];
    console.log(results);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = results.otu_ids;
    let otuLabels = results.otu_labels;
    let sampleValues = results.sample_values;


    // Build a Bubble Chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
      }
    }];
    let bubbleLayout = {
      title: 'Bacteria Culters per Sample',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Number of Bacteria' },
      width: 1000,
      height: 600
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];


    // Build a Bar Chart
    let barLayout = {
      title: `Top 10 Bacteria Cultures found in Sample ${results.id}`,
      height: 600,
      width: 800
    };
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {
    // Get the names field
    console.log(data);
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select(`#selDataset`)

    // Use the list of sample names to populate the select options
    names.forEach((id) => {
      dropdownMenu.append("option").text(id).property("value", id);
    } );
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();

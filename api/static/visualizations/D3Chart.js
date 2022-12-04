export class D3Chart {
    // Takes the selector that we want to build out chart on, as well as a path to read the data
    // sets up additional objects to hold axis, size, and margin information so it ban be accessed anywhere in the object
    constructor(selector, dataPath) {
        this.selector = selector
        this.dataPath = dataPath
        this.data = []
        this.size = {}
        this.margin = {}
        this.axis = {}
        this.svg = null
    }
    // resizes the object
    
    reSize(width, height) {
        this.size.width = width
        this.size.height = height
    }
    // resets the margin object

    reMargin(top, right, bottom, left) {
        this.margin.top = top
        this.margin.right = right
        this.margin.bottom = bottom
        this.margin.left = left
    }
    //TODO: integrate Axis building and scaling better into the object
    // builds and sets base SVG. It appends it to the selector for the object, and sets the margin correctly
    // Honeslty, this was the main reason I made the object. I didn't want to copy and paste it everywhere
    buildSVG() {
        let svg = d3.select(this.selector).append("svg")
            .attr("width", this.size.width + this.margin.left + this.margin.right)
            .attr("height", this.size.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
        this.svg = svg
    }
    // Should be overwritten by instances. All axis building and setting should happen within this
    buildAxis() {
        console.log('Impliment Build Axis')
    }
    // Should be overwritten by instances. All updating information and axis should happen within this
    updateChart() {
        console.log('Impliment Update Data')
    }
    // async method to get data
    async fetchData() {
        if (!this.dataPath) {
            this.data = []
            return
        }
        this.data = await d3.json(this.dataPath, function(data) {
            return data
        })
    }

    // Call this to build chart
    async build() {
        this.buildSVG()

        await this.fetchData()


        this.buildAxis()
        this.updateAxis()

    }
    // Should be called everytime you want to fetch and update data
    async update() {
        await this.fetchData()
        this.updateAxis()
        this.updateChart()
    }
}
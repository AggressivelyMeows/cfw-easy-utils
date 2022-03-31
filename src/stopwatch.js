export class Stopwatch {
    constructor () {
        this.start = new Date()
        this.checkpoints = [
            {
                name: 'Start',
                dur: 0,
                desc: 'Started recording'
            }
        ]
        this.lastCheckpointTime = new Date()
    }

    mark(name, options) {
        this.checkpoints.push({
            name,
            time: new Date(),
            dur: new Date() - this.lastCheckpointTime,
            ...options
        })
    
        this.lastCheckpointTime = new Date()
    }

    getTotalTime() {
        // returns total time in MS
        return new Date() - this.start
    }

    join(stopwatchInstance) {
        // combine two different Stopwatch instances
        var combined = this.checkpoints + stopwatchInstance.checkpoints
        this.checkpoints = combined.sort((a, b) => b.time - a.time)
    }

    getHeader() {
        // returns a Server-Timing header
        var out = []
        this.checkpoints.forEach((point) => {
            var values = [point.name]
            Object.keys(point).forEach(key => {
                if (key == 'name' || key == 'time') {return} // ignore the name value
                values.push(`${key}=${point[key]}`)
            })
            out.push(values.join(';'))
        })

        return out.join(',')
    }
}

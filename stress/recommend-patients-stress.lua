-- Initialize the random number generator
math.randomseed(os.time())

-- Function to generate a random number within a range
function random(min, max)
    return min + math.random() * (max - min)
end

-- Function to generate random boolean
function randomBoolean()
    return math.random() < 0.5
end

-- Function to generate a request with random parameters
request = function()
    local lat = random(-90, 90)
    local long = random(-180, 180)
    local limit = math.floor(random(1, 20))
    local include_details = randomBoolean()

    local path = string.format("/api/v1/patients/recommend?lat=%.6f&long=%.6f&limit=%d&include_details=%s",
        lat, long, limit, tostring(include_details))

    return wrk.format("GET", path)
end

-- Function to print results after the test
done = function(summary, latency, requests)
    io.write("\nTest Results:\n")
    io.write("---------------\n")
    io.write(string.format("Total Requests: %d\n", summary.requests))
    io.write(string.format("Total Responses: %d\n", summary.responses))
    io.write(string.format("Requests/sec: %.2f\n", summary.requests/(summary.duration/1000000)))
    io.write(string.format("Transfer/sec: %.2f KB\n", summary.bytes/(summary.duration/1000000)/1024))

    io.write("\nLatency Distribution:\n")
    for _, p in pairs({50, 90, 99, 99.999}) do
        n = latency:percentile(p)
        io.write(string.format("%g%%: %d ms\n", p, n/1000))
    end

    io.write("\nHTTP Response Codes:\n")
    for code, count in pairs(summary.status_codes) do
        io.write(string.format("%s: %d\n", code, count))
    end
end

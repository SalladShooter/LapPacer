const distance_input = document.getElementById("distance")
const distance_select = document.getElementById("distance-type")

const lap_distance = document.getElementById("lap-distance")
const lap_select = document.getElementById("lap-type")

const time_hours = document.getElementById("hours")
const time_minutes = document.getElementById("minutes")
const time_seconds = document.getElementById("seconds")

const submit_btn = document.getElementById("submit")

const table = document.getElementById("table")

function pad(n) {
  return n < 10 ? "0" + n : n
}

function convert_seconds_hours_minutes(total_seconds) {
  const hours = Math.floor(total_seconds / 3600)
  const remaining_seconds_hours = total_seconds % 3600
  const minutes = Math.floor(remaining_seconds_hours / 60)
  const seconds = (total_seconds % 60).toFixed(3)
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

function submit() {
  let total_distance = parseFloat(distance_input.value)
  let lap_len = parseFloat(lap_distance.value)
  let conversion = 1
  if (distance_select.value == "km" && lap_select.value == "m") conversion = 1000
  else if (distance_select.value == "mi" && lap_select.value == "ft") conversion = 5280
  else if (distance_select.value == "mi" && lap_select.value == "m") conversion = 1609.34
  else if (distance_select.value == "km" && lap_select.value == "km") conversion = 1
  else if (distance_select.value == "mi" && lap_select.value == "mi") conversion = 1
  else if (distance_select.value == "km" && lap_select.value == "ft") conversion = 3280.84
  else if (distance_select.value == "km" && lap_select.value == "mi") conversion = 0.621371
  else if (distance_select.value == "mi" && lap_select.value == "km") conversion = 1.60934
  let total_distance_lapunits = total_distance * conversion
  let seconds =
    parseFloat(time_seconds.value) +
    parseFloat(time_minutes.value) * 60 +
    parseFloat(time_hours.value) * 3600
  let total_laps = total_distance_lapunits / lap_len
  let full_laps = Math.floor(total_laps)
  let leftover_fraction = total_laps - full_laps
  let lap_time_sec = seconds / total_laps
  const rows = table.rows
  for (let row = rows.length - 1; row > 0; row--) {
    rows[row].parentNode.removeChild(rows[row])
  }
  let distance_covered = 0
  let elapsed_time = 0
  for (let lap = 1; lap <= full_laps; lap++) {
    let row = table.insertRow(-1)
    let lap_num = row.insertCell(0)
    let lap_length = row.insertCell(1)
    let total_distance_cell = row.insertCell(2)
    let lap_time = row.insertCell(3)
    let total_time = row.insertCell(4)
    lap_num.innerHTML = lap
    lap_length.innerHTML = lap_len + " " + lap_select.value
    distance_covered += lap_len
    total_distance_cell.innerHTML =
      (distance_covered / conversion).toFixed(3) + " " + distance_select.value
    let lt = convert_seconds_hours_minutes(lap_time_sec)
    lap_time.innerHTML = `${pad(lt.hours)}:${pad(lt.minutes)}:${pad(lt.seconds)}`
    elapsed_time += lap_time_sec
    let tt = convert_seconds_hours_minutes(elapsed_time)
    total_time.innerHTML = `${pad(tt.hours)}:${pad(tt.minutes)}:${pad(tt.seconds)}`
  }
  if (leftover_fraction > 0) {
    let row = table.insertRow(-1)
    let lap_num = row.insertCell(0)
    let lap_length = row.insertCell(1)
    let total_distance_cell = row.insertCell(2)
    let lap_time = row.insertCell(3)
    let total_time = row.insertCell(4)
    lap_num.innerHTML = full_laps + 1
    let partial_distance = leftover_fraction * lap_len
    console.log(partial_distance)
    if (Number.isInteger(partial_distance)) {
      lap_length.innerHTML = Math.round(partial_distance) + " " + lap_select.value
    } else {
      lap_length.innerHTML = partial_distance.toFixed(3) + " " + lap_select.value
    }
    distance_covered += partial_distance
    total_distance_cell.innerHTML =
      (distance_covered / conversion).toFixed(3) + " " + distance_select.value
    let lap_time_partial = lap_time_sec * leftover_fraction
    let lt = convert_seconds_hours_minutes(lap_time_partial)
    lap_time.innerHTML = `${pad(lt.hours)}:${pad(lt.minutes)}:${pad(lt.seconds)}`
    let tt = convert_seconds_hours_minutes(seconds)
    total_time.innerHTML = `${pad(tt.hours)}:${pad(tt.minutes)}:${pad(tt.seconds)}`
  }
}

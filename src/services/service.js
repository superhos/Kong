import music from './music'
import config from './config'

let instances = {}
let services = {
  music, config
}

export default function Service (serviceName) {
  let name = serviceName.toLowerCase()
  if (!instances[name]) {
      instances[name] = new services[name]()
  }

  return instances[name]
}
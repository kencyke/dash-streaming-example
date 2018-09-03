export class Dash {
  id: string;
  type: string;
  mpd: any;
  mediaSource: MediaSource;
  sourceBuffer: SourceBuffer;
  segmentIndex: number = 0;

  constructor(id: string, url: string) {
    this.id = id;
    this.getDescription(url, () => this.initVideo(id))
  }

  getDescription(url: string, call: () => void) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "document";
    xhr.overrideMimeType("text/xml");
    xhr.onload = event => {
      const mpd = xhr.responseXML;
      const representation = mpd.getElementsByTagName("Representation")[0];
      const mimeType = representation.getAttribute("mimeType");
      const codecs = representation.getAttribute("codecs");
      this.type = `${mimeType}; codecs="${codecs}"`
      this.mpd = mpd;
      call();
    };
    xhr.send(null);
  }

  initVideo(id: string) {
    const ms = new MediaSource();
    const video = document.getElementById(id) as HTMLVideoElement;
    ms.addEventListener("sourceopen", this.initSourceBuffer.bind(this), false);
    video.src = URL.createObjectURL(ms);
    this.mediaSource = ms;
  }

  initSourceBuffer() {
    const sb = this.mediaSource.addSourceBuffer(this.type);
    sb.addEventListener("updateend", this.appendMediaSegment.bind(this), false);
    this.sourceBuffer = sb;
    this.appendInitSegment();
  }

  appendMediaSegment() {
    const xhr = new XMLHttpRequest();
    const file = this.mpd.getElementsByTagName("SegmentURL")[this.segmentIndex++].getAttribute("media");
    xhr.open("GET", `http://localhost:8000/data/${file}`, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = this.appendSegment.bind(this);
    xhr.send(null);
  }

  appendInitSegment() {
    const xhr = new XMLHttpRequest();
    const file = this.mpd.getElementsByTagName("Initialization")[0].getAttribute("sourceURL");
    xhr.open("GET", `http://localhost:8000/data/${file}`, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = this.appendSegment.bind(this);
    xhr.send(null);
  }

  appendSegment(event: Event) {
    const target = event.target as any;
    this.sourceBuffer.appendBuffer(target.response)
  }

}

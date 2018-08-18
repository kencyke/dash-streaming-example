# dash-streaming-example

## Preprocessing

### ffmpeg

```bash
docker pull jrottenberg/ffmpeg
docker run -it --rm -v `pwd`/server/data:/tmp -w /tmp jrottenberg/ffmpeg \
        -i ./${input}.mp4 \
        -vcodec libx264 \
        -vb 500k \
        -r 30 \
        -x264opts no-scenecut \
        -g 15 \
        -acodec aac \
        -ac 2 \
        -ab 128k \
        -frag_duration 5000000 \
        -movflags frag_keyframe+empty_moov \
        ./${encoded}.mp4
```

### MP4Box

```bash
docker build -t mp4box:0.1 ./server/mp4box
docker run -it --rm -v `pwd`/server/data:/tmp -w /tmp mp4box:0.1 \
        -frag 4000 \
        -dash 4000 \
        -rap \
        -segment-name sample \
        -out ./${output}.mp4 \
        ./${encoded}.mp4
```
### npm

```bash
npm init -y
npm install --save-dev typescript ts-loader webpack webpack-cli
npx webpack --display-error-details
```

## Usage

```bash
make build
./bin/server // go to http://localhost:8000
```
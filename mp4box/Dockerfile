FROM ubuntu:18.04

WORKDIR /workdir
RUN set -x \
    && apt-get update \
    && apt-get -y install git build-essential \
    && git clone https://github.com/gpac/gpac.git \
    && cd gpac \
    && ./configure --static-mp4box --use-zlib=no \
    && make -j4 \
    && make install \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "MP4Box" ]
CMD [ "-h" ]
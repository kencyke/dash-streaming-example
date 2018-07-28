FROM ubuntu:18.04

RUN set -x \
    && apt-get update \
    && apt-get -y install git gcc make libpthread-stubs0-dev \
    && git clone https://github.com/gpac/gpac.git \
    && cd gpac \
    && ./configure --static-mp4box --use-zlib=no \
    && make -j4 \
    && make install \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && cd ../ \
    && rm -rf gpac

ENTRYPOINT [ "MP4Box" ]
CMD [ "-h" ]
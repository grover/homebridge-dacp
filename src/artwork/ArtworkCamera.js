'use strict';

var ip = require('ip');
var spawn = require('child_process').spawn;

class ArtworkCamera {

  constructor(log, hap, options) {
    this.log = log;
    this.hap = hap;
    this.options = options;


    this.services = [];
    this.streamControllers = [];

    this.pendingSessions = {};
    this.ongoingSessions = {};

    var numberOfStreams = options.maxStreams || 2;
    var videoResolutions = [];

    var maxWidth = options.maxWidth;
    var maxHeight = options.maxHeight;
    var maxFPS = (options.maxFPS > 30) ? 30 : options.maxFPS;

    if (maxWidth >= 320) {
      if (maxHeight >= 240) {
        videoResolutions.push([320, 240, maxFPS]);
        if (maxFPS > 15) {
          videoResolutions.push([320, 240, 15]);
        }
      }

      if (maxHeight >= 180) {
        videoResolutions.push([320, 180, maxFPS]);
        if (maxFPS > 15) {
          videoResolutions.push([320, 180, 15]);
        }
      }
    }

    if (maxWidth >= 480) {
      if (maxHeight >= 360) {
        videoResolutions.push([480, 360, maxFPS]);
      }

      if (maxHeight >= 270) {
        videoResolutions.push([480, 270, maxFPS]);
      }
    }

    if (maxWidth >= 640) {
      if (maxHeight >= 480) {
        videoResolutions.push([640, 480, maxFPS]);
      }

      if (maxHeight >= 360) {
        videoResolutions.push([640, 360, maxFPS]);
      }
    }

    if (maxWidth >= 1280) {
      if (maxHeight >= 960) {
        videoResolutions.push([1280, 960, maxFPS]);
      }

      if (maxHeight >= 720) {
        videoResolutions.push([1280, 720, maxFPS]);
      }
    }

    if (maxWidth >= 1920) {
      if (maxHeight >= 1080) {
        videoResolutions.push([1920, 1080, maxFPS]);
      }
    }

    let streamOptions = {
      proxy: false, // Requires RTP/RTCP MUX Proxy
      srtp: true, // Supports SRTP AES_CM_128_HMAC_SHA1_80 encryption
      video: {
        resolutions: videoResolutions,
        codec: {
          profiles: [0, 1, 2], // Enum, please refer StreamController.VideoCodecParamProfileIDTypes
          levels: [0, 1, 2] // Enum, please refer StreamController.VideoCodecParamLevelTypes
        }
      },
      audio: {
        codecs: [
          {
            type: 'OPUS', // Audio Codec
            samplerate: 24 // 8, 16, 24 KHz
          },
          {
            type: 'AAC-eld',
            samplerate: 16
          }
        ]
      }
    };

    this.createCameraControlService();
    this._createStreamControllers(numberOfStreams, streamOptions);
  }

  createCameraControlService() {
    var controlService = new this.hap.Service.CameraControl();
    this.services.push(controlService);
  }

  _createStreamControllers(maxStreams, streamOptions) {
    for (var i = 0; i < maxStreams; i++) {
      var streamController = new this.hap.StreamController(i, streamOptions, this);

      this.services.push(streamController.service);
      this.streamControllers.push(streamController);
    }
  }

  handleCloseConnection(connectionID) {
    this.streamControllers.forEach(function (controller) {
      controller.handleCloseConnection(connectionID);
    });
  }

  handleSnapshotRequest(request, callback) {
    const vf = `scale=w='min(${request.width},iw)':h='min(${request.height},ih)':force_original_aspect_ratio=decrease,pad=${request.width}:${request.height}:(ow-iw)/2:(oh-ih)/2`;
    const ffmpegCommand = `-i ${this.options.artworkImageSource} -t 1 -vf ${vf} -f image2 -`;

    this.log(`Capturing still image via ffmpeg with options: ${ffmpegCommand}`);

    let ffmpeg = spawn('ffmpeg', ffmpegCommand.split(' '), { env: process.env });
    var imageBuffer = Buffer(0);

    ffmpeg.stdout.on('data', function (data) {
      imageBuffer = Buffer.concat([imageBuffer, data]);
    });
    ffmpeg.on('close', function () {
      callback(undefined, imageBuffer);
    });
  }

  prepareStream(request, callback) {
    var sessionInfo = {};

    let sessionID = request['sessionID'];
    let targetAddress = request['targetAddress'];

    sessionInfo['address'] = targetAddress;

    var response = {};

    let videoInfo = request['video'];
    if (videoInfo) {
      let targetPort = videoInfo['port'];
      let srtp_key = videoInfo['srtp_key'];
      let srtp_salt = videoInfo['srtp_salt'];

      let videoResp = {
        port: targetPort,
        ssrc: 1,
        srtp_key: srtp_key,
        srtp_salt: srtp_salt
      };

      response['video'] = videoResp;

      sessionInfo['video_port'] = targetPort;
      sessionInfo['video_srtp'] = Buffer.concat([srtp_key, srtp_salt]);
      sessionInfo['video_ssrc'] = 1;
    }

    let audioInfo = request['audio'];
    if (audioInfo) {
      let targetPort = audioInfo['port'];
      let srtp_key = audioInfo['srtp_key'];
      let srtp_salt = audioInfo['srtp_salt'];

      let audioResp = {
        port: targetPort,
        ssrc: 1,
        srtp_key: srtp_key,
        srtp_salt: srtp_salt
      };

      response['audio'] = audioResp;

      sessionInfo['audio_port'] = targetPort;
      sessionInfo['audio_srtp'] = Buffer.concat([srtp_key, srtp_salt]);
      sessionInfo['audio_ssrc'] = 1;
    }

    let currentAddress = ip.address();
    var addressResp = {
      address: currentAddress
    };

    if (ip.isV4Format(currentAddress)) {
      addressResp['type'] = 'v4';
    } else {
      addressResp['type'] = 'v6';
    }

    response['address'] = addressResp;
    this.pendingSessions[this.hap.uuid.unparse(sessionID)] = sessionInfo;

    callback(response);
  }

  handleStreamRequest(request) {
    var sessionID = request.sessionID;
    var requestType = request.type;
    if (sessionID) {
      let sessionIdentifier = this.hap.uuid.unparse(sessionID);

      if (requestType == 'start') {
        var sessionInfo = this.pendingSessions[sessionIdentifier];
        if (sessionInfo) {
          var width = 1280;
          var height = 720;
          var fps = 30;
          var bitrate = 300;

          let videoInfo = request.video;
          if (videoInfo) {
            width = videoInfo.width;
            height = videoInfo.height;

            let expectedFPS = videoInfo.fps;
            if (expectedFPS < fps) {
              fps = expectedFPS;
            }

            bitrate = videoInfo['max_bit_rate'];
          }

          let targetAddress = sessionInfo.address;
          let targetVideoPort = sessionInfo.video_port;
          let videoKey = sessionInfo.video_srtp;
          let videoSsrc = sessionInfo.video_ssrc;

          const vf = `scale=w='min(${width},iw)':h='min(${height},ih)':force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
          const ffmpegCommand = `-v info -re -loop 1 -i ${this.options.artworkImageSource} -vf ${vf} -threads 0 -vcodec ${this.options.vcodec} -an -pix_fmt yuv420p -r ${fps} -f rawvideo -tune zerolatency -b:v ${bitrate}k -bufsize ${bitrate}k -payload_type 99 -ssrc ${videoSsrc} -f rtp -srtp_out_suite AES_CM_128_HMAC_SHA1_80 -srtp_out_params ${videoKey.toString('base64')} srtp://${targetAddress}:${targetVideoPort}?rtcpport=${targetVideoPort}&localrtcpport=${targetVideoPort}&pkt_size=1378`;
          this.log(`Launching video stream for session ${sessionIdentifier} via ffmpeg with options: ${ffmpegCommand}`);

          let ffmpeg = spawn(this.options.binary, ffmpegCommand.split(' '), { env: process.env, stdio: 'inherit' });
          this.ongoingSessions[sessionIdentifier] = ffmpeg;
        }

        delete this.pendingSessions[sessionIdentifier];
      } else if (requestType == 'stop') {
        var ffmpegProcess = this.ongoingSessions[sessionIdentifier];
        if (ffmpegProcess) {
          ffmpegProcess.kill('SIGKILL');
          this.log(`Killing ffmpeg for session: ${sessionIdentifier}`);
        }

        delete this.ongoingSessions[sessionIdentifier];
      }
    }
  }
}

module.exports = ArtworkCamera;
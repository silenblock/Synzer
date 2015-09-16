var Wave = require('../js/Wave');
global.btoa = require('btoa');
global.atob = require('atob');

describe("Wave", function() {
  describe('object', function() {
    var wave = null;
    beforeEach(function() {
      wave = new Wave();
      wave.setData([91]);
    });

    it('creates as object', function() {
      expect(wave).toEqual(jasmine.any(Object));
    });

    it('has options property', function() {
      expect(wave.options).toEqual(jasmine.any(Object));
    });

    it('getDataURI returns string which starts with data:audio/wav;base64,', function() {
      expect(wave.getDataURI().indexOf('data:audio/wav;base64,')).toEqual(0);
    });

    it('throws an error if trying to getDataURI without a data', function() {
      expect(wave.getDataURI).toThrow();
    });

    it('setData influences getDataURI output', function() {
      var oldDataURI = wave.getDataURI();
      wave.setData([1,2,3,4,5,6,7,8,9,10]);
      expect(wave.getDataURI()).not.toEqual(oldDataURI);
    })
  });

  describe('Wave format has correct header value for', function() {
    var waves, bin, views = [];
    beforeEach(function() {
      waves = [
        new Wave({channels: 1, sampleRate: 8000, bitsPerSample: 16}),
        new Wave({channels: 2, sampleRate: 44100, bitsPerSample: 8})
      ];
      waves[0].setData([]);
      waves[1].setData([1,2,3,4,5,6,7,8,9,10]);

      for(var i = 0; i < waves.length; i++) {
        bin = atob(waves[i].getDataURI().replace('data:audio/wav;base64,', ''));
        len = bin.length;
        var bytes = new Uint8Array(len);
        for (var j = 0; j < len; j++) {
          bytes[j] = bin.charCodeAt(j);
        }
        views[i] = new DataView(bytes.buffer);
      }
    });

    var str = function(view, pos, length) {
      var str = '';
      for(var i = pos; i < pos + length; i++) {
        str += String.fromCharCode(view.getUint8(i));
      }
      return str;
    };

    it('RIFF WAVE', function() {
      expect(str(views[0], 0, 4)).toBe('RIFF');
      expect(str(views[0], 8, 4)).toBe('WAVE');
      expect(str(views[1], 0, 4)).toBe('RIFF');
      expect(str(views[1], 8, 4)).toBe('WAVE');
    });

    it('chunkSize', function() {
      expect(views[0].getUint32(4, true)).toBe(36);
      expect(views[1].getUint32(4, true)).toBe(36 + 10 * 8 * 8);
    });

    it('fmt', function() {
      expect(str(views[0], 12, 3)).toBe('fmt');
      expect(str(views[1], 12, 3)).toBe('fmt');
    });

    it('SubChunk1Size', function() {
      expect(views[0].getUint32(16, true)).toBe(16);
      expect(views[1].getUint32(16, true)).toBe(16);
    });

    it('AudioFormat', function() {
      expect(views[0].getUint16(20, true)).toBe(1);
      expect(views[1].getUint16(20, true)).toBe(1);
    });

    it('NumChannels', function() {
      expect(views[0].getUint16(22, true)).toBe(1);
      expect(views[1].getUint16(22, true)).toBe(2);
    });

    it('SampleRate', function() {
      expect(views[0].getUint32(24, true)).toBe(8000);
      expect(views[1].getUint32(24, true)).toBe(44100);
    });

    it('ByteRate', function() {
      expect(views[0].getUint32(28, true)).toBe(8000 * 16 * 1 / 8);
      expect(views[1].getUint32(28, true)).toBe(44100 * 8 * 2 / 8);
    });

    it('BlockAlign', function() {
      expect(views[0].getUint16(32, true)).toBe(16 * 1 / 8);
      expect(views[1].getUint16(32, true)).toBe(8 * 2 / 8);
    });

    it('BitsPerSample', function() {
      expect(views[0].getUint16(34, true)).toBe(16);
      expect(views[1].getUint16(34, true)).toBe(8);
    });

    it('SubChunk2Size', function() {
      expect(views[0].getUint32(40, true)).toBe(0);
      expect(views[1].getUint32(40, true)).toBe(10 * 8 * 8);
    });
  });

  describe("writes correct headers for", function() {
    describe("number of channels", function() {
      it('one channel', function() {

      });
    });
    it("bit rate", function() {

    });
    it("sample rate", function() {

    });
    it("bits per sample", function() {

    });
  })
});
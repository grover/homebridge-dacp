"use strict";

const daap = {
  "abal": {
    "name": "daap.browsealbumlistung",
    "type": "list"
  },
  "abar": {
    "name": "daap.browseartistlisting   ",
    "type": "list"
  },
  "abcp": {
    "name": "daap.browsecomposerlisting",
    "type": "list"
  },
  "abgn": {
    "name": "daap.browsegenrelisting",
    "type": "list"
  },
  "abpl": {
    "name": "daap.baseplaylist",
    "type": "byte"
  },
  "abro": {
    "name": "daap.databasebrowse",
    "type": "list"
  },
  "adbs": {
    "name": "daap.databasesongs",
    "type": "list"
  },
  "aelb": {
    "name": "unknown",
    "type": "byte"
  },
  "aeCR": {
    "name": "com.apple.itunes.content-rating",
    "type": "string"
  },
  "aeCS": {
    "name": "com.apple.itunes.artworkchecksum",
    "type": "int"
  },
  "aeDL": {
    "name": "com.apple.itunes.drm-downloader-user-id",
    "type": "long"
  },
  "aeDP": {
    "name": "com.apple.itunes.drm-platform-id",
    "type": "int"
  },
  "aeDR": {
    "name": "com.apple.itunes.drm-user-id",
    "type": "long"
  },
  "aeDV": {
    "name": "com.apple.itunes.drm-versions",
    "type": "int"
  },
  "aeEN": {
    "name": "com.apple.itunes.episode-num-str",
    "type": "int"
  },
  "aeES": {
    "name": "com.apple.itunes.episode-sort",
    "type": "int"
  },
  "aeFA": {
    "name": "com.apple.itunes.drm-family-id",
    "type": "long"
  },
  "aeFP": {
    "name": "com.apple.itunes.req-fplay",
    "type": "byte"
  },
  "aeFR": {
    "name": "unknown tag",
    "type": "byte"
  },
  "aeGD": {
    "name": "com.apple.itunes.gapless-enc-dr",
    "type": "int"
  },
  "aeGE": {
    "name": "com.apple.itunes.gapless-enc-del",
    "type": "int"
  },
  "aeGH": {
    "name": "com.apple.itunes.gapless-heur",
    "type": "int"
  },
  "aeGR": {
    "name": "com.apple.itunes.gapless-resy",
    "type": "long"
  },
  "aeGU": {
    "name": "com.apple.itunes.gapless-dur",
    "type": "long"
  },
  "aeGs": {
    "name": "com.apple.itunes.can-be-genius-seed",
    "type": "byte"
  },
  "aeHD": {
    "name": "com.apple.itunes.is-hd-video",
    "type": "byte"
  },
  "aeHV": {
    "name": "com.apple.itunes.has-video",
    "type": "byte"
  },
  "aeK1": {
    "description": "",
    "name": "com.apple.itunes.drm-key1-id",
    "type": "long"
  },
  "aeK2": {
    "name": "com.apple.itunes.drm-key2-id",
    "type": "long"
  },
  "aeMK": {
    "name": "com.apple.itunes.mediakind",
    "type": "byte"
  },
  "aeMX": {
    "name": "com.apple.itunes.movie-info-xml",
    "type": "string"
  },
  "aeMk": {
    "name": "com.apple.itunes.extended-media-kind",
    "type": "byte"
  },
  "aeMQ": {
    "name": "aeMQ",
    "type": "byte"
  },
  "aeND": {
    "name": "com.apple.itunes.non-drm-user-id",
    "type": "long"
  },
  "aeNV": {
    "description": "",
    "name": "com.apple.itunes.norm-volume",
    "type": "int"
  },
  "aePC": {
    "description": "",
    "name": "com.apple.itunes.is-podcast",
    "type": "byte"
  },
  "aePP": {
    "name": "com.apple.itunes.is-podcast-playlist",
    "type": "byte"
  },
  "aePS": {
    "name": "com.apple.itunes.special-playlist",
    "type": "byte"
  },
  "aeSE": {
    "name": "com.apple.itunes.store-pers-id",
    "type": "long"
  },
  "aeSG": {
    "name": "com.apple.itunes.saved-genius",
    "type": "byte"
  },
  "aeSL": {
    "name": "unknown",
    "type": "byte"
  },
  "aeSN": {
    "name": "com.apple.itunes.series-name",
    "type": "string"
  },
  "aeSP": {
    "name": "com.apple.itunes.smart-playlist",
    "type": "byte"
  },
  "aeSR": {
    "name": "unknown",
    "type": "byte"
  },
  "aeSU": {
    "name": "com.apple.itunes.season-num",
    "type": "int"
  },
  "aeSV": {
    "name": "com.apple.itunes.music-sharing-version",
    "type": "version"
  },
  "aeSX": {
    "name": "unknown tag",
    "type": "long"
  },
  "aeTr": {
    "name": "unknown tag",
    "type": "byte"
  },
  "aeXD": {
    "name": "com.apple.itunes.xid",
    "type": "string"
  },
  "aels": {
    "name": "com.apple.itunes.liked-state",
    "type": "byte"
  },
  "agrp": {
    "name": "daap.songgrouping",
    "type": "string"
  },
  "ajal": {
    "name": "com.apple.itunes.store.album-liked-state",
    "type": "byte"
  },
  "aply": {
    "description": "response to /databases/id/containers",
    "name": "daap.databaseplaylists",
    "type": "list"
  },
  "apro": {
    "name": "daap.protocolversion",
    "type": "version"
  },
  "apso": {
    "description": "response to /databases/id/containers/id/items",
    "name": "daap.playlistsongs",
    "type": "list"
  },
  "arif": {
    "name": "daap.resolveinfo",
    "type": "list"
  },
  "arsv": {
    "name": "daap.resolve",
    "type": "list"
  },
  "asaa": {
    "name": "daap.songalbumartist",
    "type": "string"
  },
  "asac": {
    "name": "daap.songartworkcount",
    "type": "short"
  },
  "asai": {
    "name": "daap.songalbumid",
    "type": "long"
  },
  "asal": {
    "description": "the song ones should be self exp.",
    "name": "daap.songalbum",
    "type": "string"
  },
  "asar": {
    "name": "daap.songartist",
    "type": "string"
  },
  "asas": {
    "name": "daap.songalbumuserratingstatus",
    "type": "byte"
  },
  "asbk": {
    "name": "daap.bookmarkable",
    "type": "byte"
  },
  "asbr": {
    "name": "daap.songbitrate",
    "type": "short"
  },
  "asbt": {
    "name": "daap.songsbeatsperminute",
    "type": "short"
  },
  "ascd": {
    "name": "daap.songcodectype",
    "type": "int"
  },
  "ascm": {
    "name": "daap.songcomment",
    "type": "string"
  },
  "ascn": {
    "name": "daap.songcontentdescription",
    "type": "string"
  },
  "asco": {
    "name": "daap.songcompilation",
    "type": "byte"
  },
  "ascp": {
    "name": "daap.songcomposer",
    "type": "string"
  },
  "ascr": {
    "name": "daap.songcontentrating",
    "type": "byte"
  },
  "ascs": {
    "name": "daap.songcodecsubtype",
    "type": "int"
  },
  "asct": {
    "name": "daap.songcategory",
    "type": "string"
  },
  "asda": {
    "name": "daap.songdateadded",
    "type": "date"
  },
  "asdb": {
    "name": "daap.songdisabled",
    "type": "byte"
  },
  "asdc": {
    "name": "daap.songdisccount",
    "type": "short"
  },
  "asdk": {
    "name": "daap.songdatakind",
    "type": "byte"
  },
  "asdm": {
    "name": "daap.songdatemodified",
    "type": "date"
  },
  "asdn": {
    "name": "daap.songdiscnumber",
    "type": "short"
  },
  "asdt": {
    "name": "daap.songdescription",
    "type": "string"
  },
  "ased": {
    "name": "daap.songextradata",
    "type": "short"
  },
  "aseq": {
    "name": "daap.songeqpreset",
    "type": "string"
  },
  "ases": {
    "name": "daap.songexcludefromshuffle",
    "type": "byte"
  },
  "asfm": {
    "name": "daap.songformat",
    "type": "string"
  },
  "asgn": {
    "name": "daap.songgenre",
    "type": "string"
  },
  "asgp": {
    "name": "daap.songgapless",
    "type": "byte"
  },
  "asgr": {
    "name": "com.apple.itunes.gapless-resy",
    "type": "int"
  },
  "ashp": {
    "name": "daap.songhasbeenplayed",
    "type": "byte"
  },
  "askd": {
    "name": "daap.songlastskipdate",
    "type": "date"
  },
  "askp": {
    "name": "daap.songuserskipcount",
    "type": "int"
  },
  "aslr": {
    "name": "daap.songalbumuserrating",
    "type": "byte"
  },
  "asls": {
    "name": "daap.songlongsize",
    "type": "long"
  },
  "aspc": {
    "name": "daap.songuserplaycount",
    "type": "int"
  },
  "aspl": {
    "name": "daap.songdateplayed",
    "type": "date"
  },
  "aspu": {
    "name": "daap.songpodcasturl",
    "type": "string"
  },
  "asri": {
    "name": "daap.songartistid",
    "type": "long"
  },
  "asrs": {
    "name": "daap.songuserratingstatus",
    "type": "byte"
  },
  "asrv": {
    "name": "daap.songrelativevolume",
    "type": "byte"
  },
  "assa": {
    "name": "daap.sortartist",
    "type": "string"
  },
  "assc": {
    "name": "daap.sortcomposer",
    "type": "string"
  },
  "asse": {
    "name": "unknown tag",
    "type": "int"
  },
  "assl": {
    "name": "daap.sortalbumartist",
    "type": "string"
  },
  "assn": {
    "name": "daap.sortname",
    "type": "string"
  },
  "assp": {
    "description": "(in milliseconds)",
    "name": "daap.songstoptime",
    "type": "int"
  },
  "assr": {
    "name": "daap.songsamplerate",
    "type": "int"
  },
  "asss": {
    "name": "daap.sortseriesname",
    "type": "string"
  },
  "asst": {
    "description": "(in milliseconds)",
    "name": "daap.songstarttime",
    "type": "int"
  },
  "assu": {
    "name": "daap.sortalbum",
    "type": "string"
  },
  "assz": {
    "name": "daap.songsize",
    "type": "int"
  },
  "astc": {
    "name": "daap.songtrackcount",
    "type": "short"
  },
  "astm": {
    "description": "(in milliseconds)",
    "name": "daap.songtime",
    "type": "int"
  },
  "astn": {
    "name": "daap.songtracknumber",
    "type": "short"
  },
  "asul": {
    "name": "daap.songdataurl",
    "type": "string"
  },
  "asur": {
    "name": "daap.songuserrating",
    "type": "byte"
  },
  "asyr": {
    "name": "daap.songyear",
    "type": "short"
  },
  "ated": {
    "name": "daap.supportsextradata",
    "type": "short"
  },
  "atSV": {
    "name": "unknown",
    "type": "version"
  },
  "avdb": {
    "description": "response to a /databases",
    "name": "daap.serverdatabases",
    "type": "list"
  },
  "cmst": {
    "name": "dacp.playstatus",
    "type": "list"
  },
  "cafe": {
    "name": "dacp.fullscreenenabled",
    "type": "byte"
  },
  "cafs": {
    "name": "dacp.fullscreen",
    "type": "byte"
  },
  "caks": {
    "name": "dacp.unknown",
    "type": "byte"
  },
  "cana": {
    "name": "dacp.nowplayingartist",
    "type": "string"
  },
  "cang": {
    "name": "dacp.nowplayinggenre",
    "type": "string"
  },
  "canl": {
    "name": "dacp.nowplayingalbum",
    "type": "string"
  },
  "canp": {
    "name": "dacp.nowplayingids",
    "type": "int"
  },
  "caps": {
    "name": "dacp.playerstate",
    "type": "byte"
  },
  "casc": {
    "name": "dacp.unknown",
    "type": "byte"
  },
  "cash": {
    "name": "dacp.shufflestate",
    "type": "byte"
  },
  "casu": {
    "name": "dacp.su",
    "type": "byte"
  },
  "carp": {
    "name": "dacp.repeatstatus",
    "type": "byte"
  },
  "caar": {
    "type": "int"
  },
  "caas": {
    "type": "int"
  },
  "cant": {
    "name": "dacp.remainingtime",
    "type": "int"
  },
  "cast": {
    "name": "dacp.tracklength",
    "type": "int"
  },
  "cann": {
    "name": "daap.nowplayingtrack",
    "type": "string"
  },
  "casa": {
    "name": "unknown tag",
    "type": "int"
  },
  "cavc": {
    "type": "byte"
  },
  "cave": {
    "name": "dacp.visualizerenabled",
    "type": "byte"
  },
  "cavs": {
    "name": "dacp.visualizer",
    "type": "byte"
  },
  "ceGS": {
    "name": "com.apple.itunes.genius-selectable",
    "type": "byte"
  },
  "ceQu": {
    "name": "ceQu",
    "type": "byte"
  },
  "cmgt": {
    "name": "dmcp.getpropertyresponse",
    "type": "list"
  },
  "cmmk": {
    "name": "dmcp.mediakind",
    "type": "int"
  },
  "cmsr": {
    "name": "daap.revisionnumber",
    "type": "int"
  },
  "cmvo": {
    "name": "dmcp.volume",
    "type": "int"
  },
  "mbcl": {
    "name": "dmap.bag",
    "type": "list"
  },
  "mccr": {
    "description": "the response to the content-codes request",
    "name": "dmap.contentcodesresponse",
    "type": "list"
  },
  "mcna": {
    "description": "the full name of the code",
    "name": "dmap.contentcodesname",
    "type": "string"
  },
  "mcnm": {
    "description": "the four letter code",
    "name": "dmap.contentcodesnumber",
    "type": "int"
  },
  "mcon": {
    "description": "an arbitrary container",
    "name": "dmap.container",
    "type": "list"
  },
  "mctc": {
    "name": "dmap.containercount",
    "type": "int"
  },
  "mcti": {
    "description": "the id of an item in its container",
    "name": "dmap.containeritemid",
    "type": "int"
  },
  "mcty": {
    "description": "the type of the code (see appendix b for type values)",
    "name": "dmap.contentcodestype",
    "type": "short"
  },
  "mdcl": {
    "name": "dmap.dictionary",
    "type": "list"
  },
  "mdcl": {
    "description": "a dictionary entry",
    "name": "dmap.dictionary",
    "type": "list"
  },
  "mdst": {
    "name": "dmap.downloadstatus",
    "type": "byte"
  },
  "meia": {
    "name": "dmap.itemdateadded",
    "type": "date"
  },
  "meip": {
    "name": "dmap.itemdateplayed",
    "type": "date"
  },
  "mext": {
    "name": "dmap.objectextradata",
    "type": "short"
  },
  "miid": {
    "description": "an item's id",
    "name": "dmap.itemid",
    "type": "int"
  },
  "mikd": {
    "description": "the kind of item.  So far, only '2' has been seen, an audio file?",
    "name": "dmap.itemkind",
    "type": "byte"
  },
  "mimc": {
    "description": "number of items in a container",
    "name": "dmap.itemcount",
    "type": "int"
  },
  "minm": {
    "description": "an items name",
    "name": "dmap.itemname",
    "type": "string"
  },
  "mlcl": {
    "description": "a list",
    "name": "dmap.listing",
    "type": "list"
  },
  "mlid": {
    "description": "the session id for the login session",
    "name": "dmap.sessionid",
    "type": "int"
  },
  "mlit": {
    "description": "a single item in said list",
    "name": "dmap.listingitem",
    "type": "list"
  },
  "mlog": {
    "description": "response to a /login",
    "name": "dmap.loginresponse",
    "type": "list"
  },
  "mpco": {
    "name": "dmap.parentcontainerid",
    "type": "int"
  },
  "mper": {
    "description": "a persistent id",
    "name": "dmap.persistentid",
    "type": "long"
  },
  "mpro": {
    "name": "dmap.protocolversion",
    "type": "version"
  },
  "mrco": {
    "description": "number of items returned in a request",
    "name": "dmap.returnedcount",
    "type": "int"
  },
  "msal": {
    "name": "dmap.supportsuatologout",
    "type": "byte"
  },
  "msas": {
    "name": "dmap.authenticationschemes",
    "type": "byte"
  },
  "msau": {
    "name": "dmap.authenticationmethod",
    "type": "byte"
  },
  "msbr": {
    "name": "dmap.supportsbrowse",
    "type": "byte"
  },
  "mscu": {
    "name": "mscu",
    "type": "long"
  },
  "msdc": {
    "name": "dmap.databasescount",
    "type": "int"
  },
  "msed": {
    "name": "dmap.supportsedit",
    "type": "byte"
  },
  "msex": {
    "name": "dmap.supportsextensions",
    "type": "byte"
  },
  "msix": {
    "name": "dmap.supportsindex",
    "type": "byte"
  },
  "mslr": {
    "name": "dmap.loginrequired",
    "type": "byte"
  },
  "msma": {
    "name": "dmap.machineaddress",
    "type": "long"
  },
  "msml": {
    "name": "dmap.speakermachinelist",
    "type": "list"
  },
  "mspi": {
    "name": "dmap.supportspersistentids",
    "type": "byte"
  },
  "msqy": {
    "name": "dmap.supportsquery",
    "type": "byte"
  },
  "msrs": {
    "name": "dmap.supportsresolve",
    "type": "byte"
  },
  "msrv": {
    "description": "response to a /server-info",
    "name": "dmap.serverinforesponse",
    "type": "list"
  },
  "mstc": {
    "name": "dmap.utctime",
    "type": "int"
  },
  "mstm": {
    "name": "dmap.timeoutinterval",
    "type": "int"
  },
  "msto": {
    "name": "dmap.utcoffset",
    "type": "int"
  },
  "msts": {
    "name": "dmap.statusstring",
    "type": "string"
  },
  "mstt": {
    "description": "the response status code, these appear to be http status codes, e.g. 200",
    "name": "dmap.status",
    "type": "int"
  },
  "msup": {
    "name": "dmap.supportsupdate",
    "type": "byte"
  },
  "msur": {
    "description": "revision to use for requests",
    "name": "dmap.serverrevision",
    "type": "int"
  },
  "mtco": {
    "name": "dmap.specifiedtotalcount number of items in response to a request",
    "type": "int"
  },
  "mudl": {
    "description": "used in updates?  (document soon)",
    "name": "dmap.deletedidlisting",
    "type": "list"
  },
  "mupd": {
    "description": "response to a /update",
    "name": "dmap.updateresponse",
    "type": "list"
  },
  "musr": {
    "name": "dmap.serverrevision",
    "type": "int"
  },
  "muty": {
    "name": "dmap.updatetype",
    "type": "byte"
  },
  "ppro": {
    "name": "dpap.protocolversion",
    "type": "version"
  },
  "prsv": {
    "name": "daap.resolve",
    "type": "list"
  }
};

function _decode(buffer, start, end) {
  const result = {};

  for (let index = start; index <= end - 8;) {
    const code = buffer.toString('utf8', index, index + 4);
    const length = buffer.slice(index + 4, index + 8).readUInt32BE(0)
    const type = daap[code];
    if (type) {
      let value = null;
      try {
        if (type.type === 'byte') {
          value = buffer.readUInt8(index + 8);
        } else if (type.type === 'date') {
          value = buffer.readIntBE(index + 8, 4);
        } else if (type.type === 'short') {
          value = buffer.readUInt16BE(index + 8);
        } else if (type.type === 'int') {
          value = buffer.readUInt32BE(index + 8);
        } else if (type.type === 'long') {
          value = buffer.readIntBE(index + 8, 8);
        } else if (type.type === 'list') {
          value = _decode(buffer, index + 8, index + 8 + length);
        } else if (type.type === 'string') {
          value = buffer.toString('utf8', index + 8, index + 8 + length);
        } else if (type.type === 'version') {
          const v = buffer.readUInt32BE(index + 8);
          const major = Math.floor(v / 65536);
          const minor = v - major * 65536;
          value = { major: major, minor: minor };
        }
        else {
          throw new Error("What?");
        }

        result[code] = value;
      } catch (e) {
        console.log('error on %s', code);
        console.error(e);
      }
    }
    else {
      console.log(`Skipping "${code}" - don't know how to parse. length=${length}`);
    }

    index += 8 + length;
  }

  return result;
}

function decode(buffer) {
  return _decode(buffer, 0, buffer.length);
}

module.exports = {
  decode: decode
};
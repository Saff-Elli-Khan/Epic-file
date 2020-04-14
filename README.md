# Epic-file

A Filepond alternative javascript library

## Language

> HTML5

## Features

- Interface Similar To Filepond
- Drag & Drop
- Image File Preview
- Profile Theme Interface
- Fast Upload Multiple Files
- Revert Files

### Usage

Its a very easy to use library!

###### HTML

```
<input type="file" id="epic-file" style="display: none;" name="file" />

```

###### Javascript

Instantiate

```
//Instantiate Epic File Class
const file = new EpicFile();

```

Create Object

```
//Epic File Configuration
file.create("#epic-file", {
  theme_profile: false, //For single circular image file
  multiple: true, //Accept Multiple Files
  limit: 1, //Upload Files Limit
  max_size: 10, //Max File Size
  instant_upload: true, //Set True To Upload Instantly
  //Allowed File Mimes
  accept: [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "text/plain",
    "image/gif"
  ],
  preview: false, //Image Preview

  //Events Callbacks
  adding: (selectedFilesObject, browserNode) => {
    console.log("Adding File(s).");
  },
  added: (blockId, fileObject) => {
    console.log("File Has Been Added.");
  },
  removing: blockId => {
    console.log("Removing File.");
  },
  removed: blockId => {
    console.log("File Has Been Removed!");
  },
  processing: (blockId, fileObject) => {
    console.log("Uploading File.");
  },
  processed: (serverResponse, blockId, fileObject) => {
    console.log("File Has Been Uploaded");
  },
  reverting: blockId => {
    console.log("Reverting File.");
  },
  reverted: (serverResponse, blockId, fileReference) => {
    console.log("File Has Been Reverted!");
  },
  loading: filesList => {
    console.log("Loading File(s).");
  },
  loaded: (blockId, loadObject, fileObject) => {
    console.log("File Has Been Loaded.");
  },
  aborted: (blockId, fileObject) => {
    console.log("Process Has Been Aborted.");
  },

  //Manage Errors
  error: {
    add: (errorMessage, fileObject, browserNode) => {
      console.log("Unable To Add File!");
    },
    process: (serverResponse, blockId, fileObject) => {
      console.log("Upload Error!");
    },
    revert: (serverResponse, blockId, fileReference) => {
      console.log("File Revert Error!");
    }
  }
});

```

Server Configuration

```
//Server Configuration
file.server_config({
  url: "http://localhost/",

  //Upload (Process) File Headers & Post Data
  process: {
    endpoint: "index.php",
    headers: {
      "x-token": "testingtoken123"
    },
    post: {
      token: "x-token-here"
    }
  },

  //Delete (Revert) File Headers & Post Data
  revert: {
    endpoint: "index.php",
    headers: {
      "x-token": "testingtoken123"
    },
    post: {
      token: "x-token-here"
    }
  }
});

```

Load Files Programmatically

```

//Already Loaded Files
file.load([
  //First File
  {
    name: "Something",
    size: 1000,
    src: "./assets/img/logo.png"
  }
  // //Second File
  // {
  //   reference: 1001, //A Unique File ID From Server (Used To Delete File From Server)
  //   name: "Something",
  //   size: 1000,
  //   src: "fileSource.jpg"
  // }
  // //And So on...
]);

```

Sorry for any type of mistakes, Let us know what do you think about this library? Thanks!

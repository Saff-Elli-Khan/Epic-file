class EpicFile {
  //Set Options
  input = {
    selector: null,
    node: null,
    name: null
  };
  element = {
    id: null,
    node: null,
    browser: null
  };
  files_list = [];
  preview = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/pipeg",
    "image/bmp",
    "image/gif",
    "image/svg+xml",
    "image/tiff",
    "image/x-icon",
    "image/x-rgb",
    "image/ief"
  ];
  options = {
    theme_profile: false,
    max_size: 0,
    multiple: false,
    limit: 1,
    accept: [],
    preview: false,
    text:
      "Drag & drop file here or <span class='--ec-file-action'>Browse</span>",
    instant_upload: true,
    adding: null,
    added: null,
    removing: null,
    removed: null,
    reseted: null,
    processing: null,
    processed: null,
    reverting: null,
    reverted: null,
    loading: null,
    loaded: null,
    error: null,
    aborted: null
  };
  server = {
    url: "/",
    process: {
      endpoint: "",
      post: {},
      headers: {}
    },
    revert: {
      endpoint: "",
      post: {},
      headers: {}
    }
  };
  //Construct
  constructor() {
    if (!window.jQuery) throw "Jquery Is Required!";
  }
  //Set Epic File Options
  set_options(array) {
    $.extend(this.options, array);
    if (typeof array.theme_profile !== "undefined") {
      if (array.theme_profile !== false && array.theme_profile !== null) {
        this.options.multiple = false;
        this.options.limit = 1;
        this.options.preview = true;
      }
    }
    return true;
  }
  //Set Epic File
  create(selector, options) {
    //Set Element
    this.input.selector = selector;
    this.input.node = $(selector);
    let e = this.input.node;
    //Check & Resolve Name
    var name = e.attr("name");
    if (typeof name !== typeof undefined) {
      this.input.name = name;
    } else {
      name = "epic-file";
      this.input.name = name;
    }
    //Set Options
    this.set_options(options);
    //Initilize UI
    this.init(name, this.options.text);
    return true;
  }
  //Initialize the UI
  init(name, text) {
    //Create Initial Elements
    var main_node = document.createElement("div");
    var body_node = document.createElement("label");
    var browser_node = document.createElement("input");
    var txt_container_node = document.createElement("label");
    var txt_node = document.createElement("p");
    var block_container_node = document.createElement("div");
    //Wrap in Jquery
    var main = $(main_node);
    var body = $(body_node);
    var browser = $(browser_node);
    var txt_container = $(txt_container_node);
    var txt = $(txt_node);
    var block_container = $(block_container_node);
    //Set ID
    var id = "ec_file_" + name;
    main.attr({
      id: id,
      class: "--ec-file-main"
    });
    this.element.id = id;
    this.element.node = main_node;
    //Add Elements and Event Listeners To The Body.
    main.insertAfter(this.input.node);
    this.input.node.remove();
    //Set Attribute
    body.attr({
      class: "--ec-file-body centered"
    });
    if (this.options.theme_profile) {
      body.attr({
        class: "--ec-file-body centered --ec-file-circle"
      });
    }
    browser.attr({
      type: "file",
      class: "--ec-file-browse"
    });
    if (this.options.multiple) {
      browser.attr({
        multiple: true
      });
    }
    txt.attr({
      class: "--ec-file-text"
    });
    txt_container.attr({
      class: "--ec-file-text-container"
    });
    block_container.attr({
      class: "--ec-block-container"
    });
    //Append Nodes
    main.append(body);
    body.append(browser);
    body.append(txt_container);
    txt.append(text);
    txt_container.append(txt);
    body.append(block_container);
    //Add Events
    browser.on("dragenter", () => {
      browser
        .parent(".--ec-file-body")
        .parent(".--ec-file-main")
        .addClass("drag");
    });
    browser.on("dragleave", function () {
      browser
        .parent(".--ec-file-body")
        .parent(".--ec-file-main")
        .removeClass("drag");
    });
    browser.on("drop", function () {
      browser
        .parent(".--ec-file-body")
        .parent(".--ec-file-main")
        .removeClass("drag");
    });
    this.element.browser = browser;
    var self = this;
    //Detect File Change
    browser.on("change", e => {
      self.files = browser.prop("files");
      //File Adding
      if (typeof self.options.adding == "function") {
        self.options.adding(self.files, browser);
      }
      if (!self.options.multiple && Array.from(self.files).length > 1) {
        if (typeof self.options.error !== null) {
          if (typeof self.options.error.adding == "function")
            self.options.error.add(
              "Just 1 File Is Allowed!",
              self.files,
              browser
            );
        }
        self.warn(
          "Just 1 File Is Allowed! <span class='--ec-file-action'>Browse Again</span>"
        );
        throw "Just 1 File Is Allowed!";
      } else {
        if (
          self.options.multiple &&
          Array.from(self.files).length > self.options.limit
        ) {
          if (self.options.error !== null) {
            if (typeof self.options.error.adding == "function")
              self.options.error.add(
                self.options.limit + " File(s) Allowed!",
                self.files,
                browser
              );
          }
          self.warn(
            self.options.limit +
              " File(s) Allowed! <span class='--ec-file-action'>Browse Again</span>"
          );
          throw self.options.limit + " File(s) Allowed!";
        } else {
          Array.from(self.files).forEach((v, i) => {
            if (
              self.options.max_size > 0 &&
              self.byte_to_mb(v.size) > self.options.max_size
            ) {
              if (self.options.error !== null) {
                if (typeof self.options.error.adding == "function")
                  self.options.error.add(
                    "Minimum File Size Allowed Is " +
                      self.options.max_size +
                      " MB",
                    self.files,
                    browser
                  );
              }
              self.warn(
                "Minimum File Size Allowed Is " +
                  self.options.max_size +
                  " MB <span class='--ec-file-action'>Browse Again</span>"
              );
              throw (
                "Minimum File Size Allowed Is " + self.options.max_size + " MB"
              );
            } else {
              var id = Date.now() + i;
              setTimeout(() => {
                if (
                  self.options.multiple &&
                  self.files_list.length >= self.options.limit
                ) {
                  browser.prop("disabled", true);
                  if (self.options.error !== null) {
                    if (typeof self.options.error.adding == "function")
                      self.options.error.add(
                        self.options.limit + " File(s) Allowed!",
                        self.files,
                        browser
                      );
                  }
                  self.warn(
                    self.options.limit +
                      " File(s) Allowed! <span class='--ec-file-action'>Browse Again</span>"
                  );
                  throw self.options.limit + " File(s) Allowed!";
                } else {
                  if (
                    self.options.accept.length == 0 ||
                    self.options.accept.includes(v.type)
                  ) {
                    txt_container.find(".--ec-file-text").empty();
                    txt_container
                      .find(".--ec-file-text")
                      .append(self.options.text);
                    body.removeClass("--file-warning");
                    self.add_file_block(id, v);
                  } else {
                    if (self.options.error !== null) {
                      if (typeof self.options.error.adding == "function")
                        self.options.error.add(
                          "Invalid File Formate!",
                          self.files,
                          browser
                        );
                    }
                    self.warn(
                      "Invalid File Formate! <span class='--ec-file-action'>Browse Again</span>"
                    );
                    throw "Invalid File Formate!";
                  }
                }
              }, 300 * i);
            }
          });
          browser.val("");
        }
      }
    });
    return true;
  }
  //Add File Block
  add_file_block(id, file, object = true) {
    var self = this;
    if (!self.options.multiple) {
      self.element.browser.prop("disabled", true);
    }
    if (object) {
      var delete_cl = "--ec-control-hidden";
      var remove_cl = "";
      var process_cl = "";
    } else {
      var delete_cl = "";
      var remove_cl = "--ec-control-hidden";
      var process_cl = "--ec-control-hidden";
    }
    var me = $(this.element.node);
    //Icons
    var remove_icon = `<svg width="100%" height="100%" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"></path>
            </svg>`;
    var reload_icon = `<svg width="100%" height="100%" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.185 10.81l.02-.038A4.997 4.997 0 0 1 13.683 8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 1 1 0 0 0 0 2A7 7 0 1 0 7.496 9.722l-.21-.842a.999.999 0 1 0-1.94.484l.806 3.23c.133.535.675.86 1.21.73l3.233-.803a.997.997 0 0 0 .73-1.21.997.997 0 0 0-1.21-.73l-.928.23-.002-.001z" fill="currentColor" fill-rule="nonzero"></path>
            </svg>`;
    var upload_icon = `<svg width="100%" height="100%" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 10.414v3.585a1 1 0 0 1-2 0v-3.585l-1.293 1.293a1 1 0 0 1-1.414-1.415l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.415L14 10.414zM9 18a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H9z" fill="currentColor" fill-rule="evenodd"></path>
            </svg>`;

    var block = `
            <div class="--ec-file-block --ec-file-block-in" id="${id}">
                <div class="--ec-file-row">
                    <div class="--ec-file-col-6">
                        <div onclick="return false;" class="--ec-file-btn-container ${remove_cl} --ec-file-remove --ec-file-float-left">
                            <div class="--ec-file-btn-pad">
                                <div class="--ec-file-btn --ec-file-btn-remove">
                                    ${remove_icon}
                                </div>
                            </div>
                        </div>
                        <p class="--ec-file-block-text --ec-text-file-name --ec-text-light">${
                          file.name
                        }</p>
                        <p class="--ec-file-block-text --ec-text-file-size --ec-text-sm --ec-text-semi-light">${this.size_calc(
                          file.size
                        )}</p>
                        <form onsubmit="return false;" class="--ec-file-form">
                            <input class="--ec-file" style="display:none;" name="${
                              this.input.name
                            }" type="file" />
                        </form>
                    </div>
                    <div class="--ec-file-col-6 --ec-file-text-right">
                        <div onclick="return false;" class="--ec-file-btn-container --ec-control-hidden --ec-file-abort --ec-file-float-right">
                            <div class="--ec-file-btn-pad">
                                <div class="--ec-file-btn --ec-file-loading"></div>
                            </div>
                        </div>
                        <div onclick="return false;" class="--ec-file-btn-container --ec-control-hidden --ec-file-revert --ec-file-float-right">
                            <div class="--ec-file-btn-pad">
                                <div class="--ec-file-btn --ec-file-btn-reload">
                                    ${reload_icon}
                                </div>
                            </div>
                        </div>
                        <div onclick="return false;" class="--ec-file-btn-container ${process_cl} --ec-file-process --ec-file-float-right">
                            <div class="--ec-file-btn-pad">
                                <div class="--ec-file-btn --ec-file-btn-upload">
                                    ${upload_icon}
                                </div>
                            </div>
                        </div>
                        <div onclick="return false;" class="--ec-file-btn-container ${delete_cl} --ec-file-delete --ec-file-float-right">
                            <div class="--ec-file-btn-pad">
                                <div class="--ec-file-btn --ec-file-btn-delete">
                                    ${remove_icon}
                                </div>
                            </div>
                        </div>
                        <p class="--ec-file-block-text --ec-text-status --ec-text-light">Process</p>
                        <p class="--ec-file-block-text --ec-text-action --ec-text-sm --ec-text-semi-light">Start Upload</p>
                    </div>
                </div>
            </div>
            `;
    me.find(".--ec-block-container").prepend(block);
    if (object) {
      var src = null;
      if (
        FileReader &&
        this.options.preview &&
        this.preview.includes(file.type)
      ) {
        var fr = new FileReader();
        fr.onload = function () {
          var r = fr.result;
          src = r;
          $("#" + id).addClass("--ec-file-preview");
          setTimeout(() => {
            $("#" + id).attr({
              style: "background-image: url('" + r + "')!important;"
            });
          }, 300);
        };
        fr.readAsDataURL(file);
      }
      var files_list = this.create_files_list(file);
      $("#" + id + " .--ec-file").prop("files", files_list);
      this.files_list.push({
        id: id,
        name: file.name,
        size: file.size,
        type: file.type,
        reference: null,
        file: file,
        src: src
      });
      //File Added
      if (typeof this.options.added == "function") {
        this.options.added(id, file);
      }
      //Instant Upload
      if (this.options.instant_upload) {
        this.process(id, file);
      }

      $("#" + id + " .--ec-file-process").on("click", () => {
        self.process(id, file);
      });
      $("#" + id + " .--ec-file-btn-remove").on("click", function () {
        self.remove_block(id);
      });
      $("#" + id + " .--ec-file-revert").on("click", () => {
        $("#" + id + " .--ec-file-remove").removeClass("--ec-control-hidden");
        $("#" + id + " .--ec-file-process").removeClass("--ec-control-hidden");
        $("#" + id + " .--ec-file-revert").addClass("--ec-control-hidden");
        $("#" + id + " .--ec-text-status").text("File Reverted");
        $("#" + id + " .--ec-text-action").text("Process Again");
        self.revert(id);
      });
    } else {
      if (
        self.options.preview &&
        typeof file.src !== "undefined" &&
        file.src !== null
      ) {
        var img = new Image();
        img.onload = function () {
          $("#" + id).addClass("--ec-file-preview");
          setTimeout(() => {
            $("#" + id).attr({
              style: "background-image: url('" + file.src + "')!important;"
            });
          }, 300);
        };
        img.src = file.src;
      }
      $("#" + id + " .--ec-file-delete").on("click", () => {
        self.revert(id, true);
      });
      $("#" + id + " .--ec-text-status").text("Delete File");
      $("#" + id + " .--ec-text-action").text("Tap To Delete");
    }
    if (self.options.multiple && self.files_list.length >= self.options.limit) {
      self.element.browser.prop("disabled", true);
    }
  }
  //Remove File Block
  remove_block(id) {
    self = this;
    if (typeof self.options.removing === "function") self.options.removing(id);
    var array = [];
    this.files_list.forEach((v, i) => {
      if (v.id == id) {
        $("#" + id).addClass("--ec-file-block-out");
        setTimeout(() => {
          $("#" + id).remove();
          if (
            self.options.multiple &&
            self.files_list.length < self.options.limit
          ) {
            self.element.browser.prop("disabled", false);
          } else if (!self.options.multiple && self.files_list.length < 1) {
            self.element.browser.prop("disabled", false);
          }
          if (typeof self.options.removed === "function")
            self.options.removed(id);
        }, 400);
      } else {
        array.push(v);
      }
    });
    self.files_list = array;
    return true;
  }
  //Size Calculator
  size_calc(size) {
    if (size <= 0) {
      return "0 Bytes";
    } else if (size < 1000) {
      return size + " Bytes";
    } else {
      var r = size / 1000;
      if (r > 1000) {
        r = r / 1000;
        if (r > 1000) {
          r = r / 1000;
          if (r > 1000) {
            return "1000 GB+";
          } else {
            return Math.round(r) + " GB";
          }
        } else {
          return Math.round(r) + " MB";
        }
      } else {
        return Math.round(r) + " KB";
      }
    }
  }
  //Byte To MB Converter
  byte_to_mb(size) {
    return size / 1000 / 1000;
  }
  //Create FileList
  create_files_list(a) {
    a = [].slice.call(Array.isArray(a) ? a : arguments);
    for (var c, b = (c = a.length), d = !0; b-- && d; )
      d = a[b] instanceof File;
    if (!d)
      throw new TypeError(
        "expected argument to FileList is File or array of File objects"
      );
    for (b = new ClipboardEvent("").clipboardData || new DataTransfer(); c--; )
      b.items.add(a[c]);
    return b.files;
  }
  //Browse
  browse() {
    $(this.element.browser).trigger("click");
  }
  //Set Server Configuration
  server_config(server) {
    if (typeof server.url !== "undefined") this.server.url = server.url;
    if (typeof server.process !== "undefined") {
      if (typeof server.process.endpoint !== "undefined")
        this.server.process.endpoint = server.process.endpoint;
    }
    if (typeof server.revert !== "undefined") {
      if (typeof server.revert.endpoint !== "undefined")
        this.server.revert.endpoint = server.revert.endpoint;
    }
    if (typeof server.process !== "undefined") {
      if (typeof server.process.headers !== "undefined")
        this.server.process.headers = server.process.headers;
    }
    if (typeof server.revert !== "undefined") {
      if (typeof server.revert.headers !== "undefined")
        this.server.revert.headers = server.revert.headers;
    }
    if (typeof server.process !== "undefined") {
      if (typeof server.process.post !== "undefined")
        this.server.process.post = server.process.post;
    }
    if (typeof server.revert !== "undefined") {
      if (typeof server.revert.post !== "undefined")
        this.server.revert.post = server.revert.post;
    }
  }
  //Update Progress
  progress(id, e) {
    var text = "Uploading 0%";
    $("#" + id + " .--ec-text-action").text("Tap to Cancel");
    $("#" + id + " .--ec-file-remove").addClass("--ec-control-hidden");
    $("#" + id + " .--ec-file-process").addClass("--ec-control-hidden");
    $("#" + id + " .--ec-file-abort").removeClass("--ec-control-hidden");
    if (e.lengthComputable) {
      var percentage = (e.loaded / e.total) * 100;
      text = "Uploading " + Math.round(percentage) + "%";
      $("#" + id + " .--ec-text-status").text(text);
    } else {
      $("#" + id + " .--ec-text-status").text(text);
    }
  }
  //Process File
  process(id, file) {
    var self = this;
    if (typeof self.options.processing === "function")
      self.options.processing(id, file);
    var data = new FormData();
    data.append(this.input.name, file);
    for (var key of Object.keys(self.server.process.post)) {
      data.append(key, self.server.process.post[key]);
    }
    var process = $.ajax({
      type: "POST",
      url: self.server.url + self.server.process.endpoint,
      headers: self.server.process.headers,
      data: data,
      contentType: false,
      cache: false,
      processData: false,
      xhr: () => {
        // Custom XMLHttpRequest
        var xhr = $.ajaxSettings.xhr();
        if (xhr.upload) {
          // Attach a function to handle the progress of the upload
          xhr.upload.addEventListener(
            "progress",
            e => {
              self.progress(id, e);
            },
            false
          );
        }
        return xhr;
      },
      success: data => {
        //Post Success
        $("#" + id + " .--ec-text-action").text("Revert");
        $("#" + id + " .--ec-file-abort").addClass("--ec-control-hidden");
        $("#" + id + " .--ec-file-revert").removeClass("--ec-control-hidden");
        $("#" + id).addClass("--ec-block-success");
        if (self.options.processed !== null) {
          if (typeof self.options.processed === "function")
            self.options.processed(data, id, file);
        }
      },
      error: data => {
        //Post Error
        self.warn("Unable To Upload File(s)!", true);
        $("#" + id).addClass("--ec-block-warning");
        $("#" + id + " .--ec-text-status").text("Error Occured!");
        $("#" + id + " .--ec-text-action").text("Try Again");
        $("#" + id + " .--ec-file-remove").removeClass("--ec-control-hidden");
        $("#" + id + " .--ec-file-abort").addClass("--ec-control-hidden");
        $("#" + id + " .--ec-file-revert").addClass("--ec-control-hidden");
        $("#" + id + " .--ec-file-process").removeClass("--ec-control-hidden");
        if (self.options.error !== null) {
          if (typeof self.options.error.process === "function")
            self.options.error.process(data, id, file);
        }
      }
    });
    $("#" + id + " .--ec-file-abort").on("click", () => {
      process.abort();
      $("#" + id + " .--ec-file-abort").addClass("--ec-control-hidden");
      $("#" + id + " .--ec-file-remove").removeClass("--ec-control-hidden");
      $("#" + id + " .--ec-file-process").removeClass("--ec-control-hidden");
      $("#" + id + " .--ec-text-status").text("Cancelled");
      $("#" + id + " .--ec-text-action").text("Process Again");
      $("#" + id + " .--ec-file-abort").unbind("click");
      if (typeof self.options.aborted === "function")
        self.options.aborted(id, file);
    });
  }
  //Revert File
  revert(id, remove = false) {
    var self = this;
    if (typeof self.options.reverting === "function")
      self.options.reverting(id);
    $("#" + id).removeClass("--ec-block-success");
    var data = self.server.revert.post;
    self.files_list.forEach((v, i) => {
      if (v.id == id) {
        if (v.reference !== null) {
          data["id"] = v.reference;
          $.ajax({
            type: "POST",
            url: self.server.url + self.server.revert.endpoint,
            headers: self.server.revert.headers,
            data: data,
            success: function (data) {
              //Post Success
              if (typeof self.options.reverted === "function")
                self.options.reverted(data, id, v.reference);
              //Remove Block
              if (remove) {
                self.remove_block(id);
              }
            },
            error: function (data) {
              //Post Error
              self.warn("Unable To Revert File(s)!", true);
              $("#" + id + " .--ec-text-status").text("Error Occured!");
              $("#" + id + " .--ec-text-action").text("Try Again");
              $("#" + id).addClass("--ec-block-warning");
              if (self.options.error !== null) {
                if (typeof self.options.error.revert === "function")
                  self.options.error.revert(data, id, v.reference);
              }
            }
          });
        } else {
          //Remove Block
          if (remove) {
            self.remove_block(id);
          }
        }
      }
    });
  }
  //Set Server File Reference
  set_reference(id, reference) {
    self = this;
    this.files_list.forEach((v, i) => {
      if (v.id == id) {
        self.files_list[i].reference = reference;
      }
    });
  }
  //Private Warnings
  warn(message, just_shake = false) {
    self = this;
    if (!just_shake) {
      $(self.element.node).find(".--ec-file-text").html(message);
      $(self.element.node).find(".--ec-file-body").addClass("--file-warning");
    }
    $(self.element.node)
      .find(".--ec-file-body")
      .addClass("--file-warning-shake");
    setTimeout(() => {
      $(self.element.node)
        .find(".--ec-file-body")
        .removeClass("--file-warning-shake");
    }, 500);
  }
  //Load Files To Plugin
  load(files_list) {
    self = this;
    if (typeof self.options.loading === "function")
      self.options.loading(files_list);
    var array = [];
    var me = $(this.element.node);
    me.find(".--ec-block-container").empty();
    files_list.forEach((v, i) => {
      if (self.options.theme_profile && array.length > 0) {
        //Do nothing
      } else {
        if (typeof v.reference === "undefined" || v.reference == null) {
          v.reference = null;
        } else if (typeof v.name === "undefined" || v.name == null) {
          v.name = "Unknown";
        } else if (typeof v.size === "undefined" || v.size == null) {
          v.size = 0;
        } else if (typeof v.src === "undefined") {
          v.src = null;
        }
        var id = Date.now() + i;
        v.id = id;
        array.push(v);
        self.add_file_block(id, v, false);
        if (typeof self.options.loaded === "function")
          self.options.loaded(id, v, files_list);
      }
    });
    self.files_list = array;
    if (self.options.multiple && self.files_list.length >= self.options.limit) {
      self.element.browser.prop("disabled", true);
    }
  }
  //Reset UI
  reset() {
    self = this;
    this.load([]);
    if (self.options.multiple && self.files_list.length < self.options.limit) {
      self.element.browser.prop("disabled", false);
    } else if (!self.options.multiple && self.files_list.length < 1) {
      self.element.browser.prop("disabled", false);
    }
    if (typeof self.options.reseted === "function") self.options.reseted();
  }
}

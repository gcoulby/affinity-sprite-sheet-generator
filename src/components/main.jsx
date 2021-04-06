import React, { Component } from "react";
import "xml-js/dist/xml-js.js";
import _ from "lodash";
import logo from "../img/logo.svg";

class Main extends Component {
  state = {
    files: [],
    filename: "svg_sprite_sheet",
    svg: {
      svg: [],
    },
    color: "#787878",
    progress: 0,
    xml: {
      declaration: {
        attributes: {
          version: "1.0",
          encoding: "iso-8859-1",
        },
      },
      elements: [
        {
          type: "comment",
          comment: " Generator: Affinity SVG Asset Cleaner by Graham Coulby https://grahamcoulby.co.uk/",
        },
        {
          type: "element",
          name: "svg",
          attributes: {
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 64 64",
            style: "enable-background:new 0 0 64 64;",
            "xml:space": "preserve",
          },
          elements: [],
        },
      ],
    },
  };

  handleFilesChange = (evt) => {
    const files = [];

    for (let i = 0; i < evt.target.files.length; i++) {
      const file = evt.target.files[i];
      console.log(file.webkitRelativePath);
      files.push(file);
    }
    this.setState({ files });
  };

  handleCreateButtonClicked = () => {
    const xml = this.state.xml;
    xml.elements[1].elements = [];
    this.setState({ xml });

    this.state.files.map((file, i) => {
      this.setProgress(i);
      this.readBlob(file, i);
    });

    this.setProgress(this.state.files.length);
  };

  recurse(nodes, path) {
    return _.map(nodes, function (node) {
      var newPath = _.union(path, [node.name]);
      return [
        _.assign({ pathname: newPath.join(" > "), level: path.length }, _.omit(node, "children")),
        this.recurse(node.children, newPath),
      ];
    });
  }

  setProgress = (i) => {
    const progress = (i > 0 ? i / this.state.files.length : 0) * 100;

    this.setState({ progress });
  };

  findPath = (obj, id, key = "path") => {
    if (_.has(obj, key)) return [obj];
    return _.flatten(
      _.map(obj, (v) => {
        let o = typeof v == "object" ? this.findPath(v, key) : [];

        return o;
      }),
      true
    );
  };

  readBlob = (file, i) => {
    let start = 0;
    let stop = file.size - 1;
    let reader = new FileReader();
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        this.setState({ fileContents: evt.target.result });
        var convert = require("xml-js");
        let result = convert.xml2js(evt.target.result, {
          compact: true,
          spaces: 4,
        });
        let s = this.findPath(result);
        try {
          let path = {
            type: "element",
            name: "path",
            attributes: { d: s[0].path._attributes.d, id: file.name.replace(".svg", ""), fill: this.state.color },
          };
          const xml = this.state.xml;
          xml.elements[1]?.elements.push(path);
          //   this.state.xml.elements[1]?.elements.push(path);
          //     xml.elements[1].elements = [];
          this.setState({ xml });
        } catch (ex) {
          console.log(ex, file.name);
        }
        if (i == this.state.files.length - 1) {
          this.downloadFile();
        }
      }
    };
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
  };

  downloadFile = () => {
    var convert = require("xml-js");
    let xml = convert.js2xml(this.state.xml);
    let blob = new Blob([xml]);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display:none");
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${this.state.filename}.svg` ?? "svg_sprite_sheet.svg";
    a.click();
    window.URL.revokeObjectURL(url);
    this.setProgress(0);
  };

  onColorChange = (evt) => {
    this.setState({ color: evt.target.value });
  };

  handleFilenameChange = (evt) => {
    this.setState({ filename: evt.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div class="container-fluid bg-dark text-light pt-5 page">
          <div class="row">
            <div class="col-lg-12 text-center">
              <img src={logo} width="100" />
              <h1 class="mt-5">Affinity Asset Sprite Sheet Creator</h1>
              <div class="row text-center">
                <div className="col">
                  <h4>1. Choose Color</h4>
                  <input
                    type="color"
                    id="html5colorpicker"
                    value={this.state.color}
                    onChange={(e) => this.onColorChange(e)}
                    className="form-control"
                  />
                  <h4 className="mt-5">2. Choose Files</h4>
                  <input
                    type="file"
                    id="fileChooser"
                    multiple
                    onChange={(e) => this.handleFilesChange(e)}
                    accept="image/svg, .svg"
                    className="form-control bg-dark text-light"
                  />
                </div>
              </div>

              <div className="row text-center justify-content-md-center">
                <div className="col-3">
                  <h4 className="mt-5">3. Choose a filename</h4>
                  <input
                    placeholder="filename"
                    className="form-control"
                    value={this.state.filename}
                    onChange={(e) => this.handleFilenameChange(e)}
                  />
                </div>
              </div>

              <div className="row text-center">
                <div className="col">
                  <h4 className="mt-5">3. Create Sprite Sheet</h4>
                  <button className="btn btn-outline-light" onClick={() => this.handleCreateButtonClicked()}>
                    Create
                  </button>
                </div>
              </div>

              <div className="row text-center mt-2 mb-4 justify-content-md-center">
                <div className="col-4">
                  <div class="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: this.state.progress + "%" }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Main;

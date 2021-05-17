import React from "react";
import clsx from "clsx";
import styles from "./Note.css";

export default function NoteToViewer() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center padding-horiz--md">
          <br /> <br /> <br />
          <h2>
            {" "}
            🚧 Note: this is WIP. All content is housed in{" "}
            <a href="https://github.com/sacha-l/substrate-how-to-guides">
              this repo
            </a>
            .🚧
          </h2>
          <h3>Contributions and feedback welcome. Please submit an Issue or PR. 😃</h3>
          <p>
            <strong>Prelude:</strong> Substrate is all about combining{" "}
            <a href="https://substrate.dev/docs/en/knowledgebase/runtime/primitives">
              {" "}
              bullet-proof primitives{" "}
            </a>{" "}
            and building on them in ways that offer powerful and robust
            programmable logic.
          </p>
          <p>
            The <strong> Substrate how-to guide book</strong> intends to help
            new and experienced Substrate developers to do just that. By
            building things up from simple components, the purpose of this ressource
            is to serve as a collection of "how-to" guides for developers looking to understand
            integration techniques of both simple and more complex capabilities
            that Substrate and FRAME offers.
          </p>
        </div>
      </div>
    </section>
  );
}

(ns ui.frontend.core.jsonld-spec
  (:require [cljs.test :refer [deftest is async]]
            [ui.frontend.core.jsonld :as j]
            [clojure.core.async :refer-macros [go]]
            [clojure.core.async :as a]))

(deftest canary-test
  (is (= 2 (+ 1 1))))

(def doc {"http://schema.org/name" "Manu Sporny"
          "http://schema.org/url" {"@id" "http://manu.sporny.org/"}
          "http://schema.org/image" {"@id" "http://manu.sporny.org/images/manu.png"}})

(def context {"name" "http://schema.org/name"
              "homepage" {"@id" "http://schema.org/url" "@type" "@id"}
              "image" {"@id" "http://schema.org/image" "@type" "@id"}})

(def compacted {"@context" {"name" "http://schema.org/name"
                            "homepage" {"@id" "http://schema.org/url"
                                        "@type" "@id"},
                            "image" {"@id" "http://schema.org/image"
                                     "@type" "@id"}},
                "image" "http://manu.sporny.org/images/manu.png"
                "name" "Manu Sporny"
                "homepage" "http://manu.sporny.org/"})

(def expanded [{"http://schema.org/name" [{"@value" "Manu Sporny"}]
                "http://schema.org/url" [{"@id" "http://manu.sporny.org/"}]
                "http://schema.org/image" [{"@id" "http://manu.sporny.org/images/manu.png"}]}])

(deftest compact
  (async done (go (is (= compacted (<! (j/compact doc context))))
                  (done))))

(deftest expand
  (async done (go (is (= expanded (<! (j/expand compacted))))
                  (done))))

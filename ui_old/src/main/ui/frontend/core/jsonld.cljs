(ns ui.frontend.core.jsonld
  (:require
   [clojure.core.async :refer-macros [go]]
   [clojure.core.async :as a]
   ["jsonld/dist/jsonld" :as jsonld]))

(defn compact [doc ctx]
  (let [c (a/chan)]
    (-> (.compact jsonld (clj->js doc) (clj->js ctx))
        (.then (fn [compacted] (a/put! c (js->clj compacted)))
               (fn [err] (js/console.error err))))

    c))

(defn expand [compacted]
  (let [c (a/chan)]
    (-> (.expand jsonld (clj->js compacted))
        (.then (fn [expanded] (a/put! c (js->clj expanded)))
               (fn [err] (js/console.error
                          (str "Failed to expand json ld object: "
                               (.-message err))))))
    c))

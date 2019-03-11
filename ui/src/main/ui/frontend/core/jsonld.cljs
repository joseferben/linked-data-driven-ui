(ns ui.frontend.core.jsonld
  (:require ["jsonld" :as jsonld]
            [clojure.core.async :refer-macros [go]]
            [clojure.core.async :as a]))

(defn compact [doc ctx]
  (let [c (a/chan)]
    (.compact jsonld (clj->js doc) (clj->js ctx)
              (fn [err compacted]
                (when err
                  (js/console.error err))
                (a/put! c (js->clj compacted))))
    c))

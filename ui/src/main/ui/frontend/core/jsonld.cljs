(ns ui.frontend.core.jsonld
  (:require ["jsonld" :as jsonld]
            [clojure.core.async :refer-macros [go]]
            [clojure.core.async :as a]
            [clojure.pprint :refer [pprint]]))

(defn compact [doc ctx]
  (let [c (a/chan)]
    (.compact jsonld (clj->js doc) (clj->js ctx)
              (fn [err compacted]
                (when err
                  (js/console.error err))
                (a/put! c (js->clj compacted))))
    c))

(defn expand [compacted]
  (let [c (a/chan)]
    (.expand jsonld (clj->js compacted)
             (fn [err expanded]
               (when err
                 (js/console.error err))
               (pprint expanded)
               (a/put! c (js->clj expanded))))
    c))

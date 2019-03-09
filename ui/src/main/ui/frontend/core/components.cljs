(ns ui.frontend.core.components
  (:require [reagent.core :as r]
            ["jsoneditor" :as JsonEditor]))

(declare play-ground)
(declare data-explorer)
(declare canvas)
(declare json-editor)

(defn json-editor []
  (let [state (r/atom {})]
    (r/create-class
     {:component-did-mount
      (fn [] (swap! state assoc :editor
                   (JsonEditor. (.getElementById js/document "json-editor")
                                (clj->js {:mode "code" }))))
      :display-name "json-editor"
      :reagent-render
      (fn []
        [:div#json-editor {:style {:height "800px"}}])})))

(defn data-explorer []
  [:div
   [:h3 "Data explorer"]
   [json-editor]])

(defn canvas []
  [:h3 "Rendered data"])

(def split-item-style {:width "50%" :padding "0.5em" :min-height "1000px"})
(defn play-ground []
  [:div {:style {:display "flex"}}
   [:div {:style split-item-style} [data-explorer]]
   [:div {:style split-item-style} [canvas]]])

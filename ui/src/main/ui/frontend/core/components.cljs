(ns ui.frontend.core.components
  (:require [reagent.core :as r]
            [ui.frontend.core.state :refer [data-state]]
            ["jsoneditor" :as JsonEditor]))

(declare play-ground)
(declare data-explorer)
(declare canvas)
(declare json-editor)

(defn json-editor []
  (let [editor-state (r/atom {})]
    (r/create-class
     {:component-did-mount
      (fn []
        (swap! editor-state assoc :editor
               (JsonEditor. (.getElementById js/document "json-editor")
                            (clj->js {:mode "code" :modes ["code" "text" "tree"]
                                      :onChangeText (fn [json]
                                                      (js/console.log (str "Updating state: " json))
                                                      (swap! data-state assoc :data json)
                                                      )}))))
      :display-name "json-editor"
      :reagent-render
      (fn []
        (when-let [e (:editor @editor-state)] (.set e (:data @data-state)))
        [:div#json-editor {:style {:height "800px"}}])})))

(defn data-explorer []
  [:div
   [:h3 "Data explorer"]
   [json-editor]])

(defn canvas [d render]
  [:div
   [:h3 "Rendered tata"]
   [:div [render d]]])

(def split-item-style {:width "50%" :padding "0.5em" :min-height "1000px"})
(defn play-ground [render]
  [:div {:style {:display "flex"}}
   [:div {:style split-item-style} [data-explorer]]
   [:div {:style split-item-style} [canvas (:data @data-state) render]]])

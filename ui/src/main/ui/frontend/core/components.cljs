(ns ui.frontend.core.components
  (:require [reagent.core :as r]
            [ui.frontend.core.state :as s]
            ["jsoneditor" :as JsonEditor]))

(declare play-ground)
(declare data-explorer)
(declare canvas)
(declare json-editor)

(def editor-config
  {:mode "code" :modes ["code" "text" "tree"]
   :onChangeText s/store!})

(defn json-editor [init-json]
  (let [editor-state (r/atom {})]
    (r/create-class
     {:component-did-mount
      (fn []
        (print "component did mount")
        (swap! editor-state assoc :editor
               (JsonEditor.
                (.getElementById js/document "json-editor")
                (clj->js editor-config))))
      :display-name "json-editor"
      :reagent-render
      (fn [init-json]
        (when-let [e (:editor @editor-state)] (do (.set e init-json) (print init-json)))
        [:div#json-editor {:style {:height "800px"}}])})))

(def foo (r/atom nil))
(defn left-split [d]
  [:div
   [:h3 "Data explorer"]
   [:div {:style {:margin-bottom "0.5em"}}
    [:label {:for "data-select"} "Choose a data set: "]
    [:select#data-select {:on-change #(reset! foo (-> % .-target .-value keyword d))}
     (map (fn [k] [:option {:value k :key k} k]) (keys d))]]
   [json-editor (clj->js @foo)]])

(defn right-split [render d]
  [:div
   [:h3 "Rendered data"]
   [:div [render d]]])

(def split-item-style {:width "50%" :padding "0.5em" :min-height "1000px"})
(defn play-ground [render init-state]
  [:div {:style {:display "flex"}}
   [:div {:style split-item-style} [left-split init-state]]
   [:div {:style split-item-style} [right-split render (s/fetch!)]]])

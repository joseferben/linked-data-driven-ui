(ns ui.frontend.core.components
  (:require [reagent.core :as r]
            [ui.frontend.core.db :as db]
            [clojure.core.async :refer-macros [go]]
            [clojure.core.async :as a]
            ["jsoneditor" :as JsonEditor]))

(declare play-ground)
(declare data-explorer)
(declare canvas)
(declare json-editor)

(def editor-config
  {:mode "code" :modes ["code" "text" "tree"]
   :onChangeText db/store-data-to-render!})

(defn json-editor [init-json]
  (let [editor-state (r/atom {:editor nil})]
    (r/create-class
     {:component-did-mount
      (fn []
        (swap! editor-state assoc :editor
               (JsonEditor.
                (.getElementById js/document "json-editor")
                (clj->js editor-config))))
      :display-name "json-editor"
      :reagent-render
      (fn [init-json]
        (when-let [e (:editor @editor-state)]
          (.set (:editor @editor-state) init-json))
        [:div#json-editor {:style {:height "800px"}}])})))

(defn expanded-data [to-render]
  (let [state (r/atom "Loading...")]
    (fn [to-render]
      (go (reset! state (.stringify js/JSON to-render nil 2)))
      [:textarea {:read-only true :style {:width "100%" :height "800px"}
                  :value @state}])))

(defn left-split []
  [:div
   [:h3 "Data explorer"]
   [:div {:style {:margin-bottom "0.5em"}}
    [:label {:for "data-select"} "Choose a data set: "]
    [:select#data-select
     {:on-change #(do (swap! db/state assoc :selected-use-case-key
                             (-> % .-target .-value keyword))
                      (reset! db/data-to-render (db/fetch-selected-use-case)))}
     (map (fn [k] [:option {:value k :key k} k]) (keys (:use-cases @db/state)))]]
   [json-editor (db/fetch-selected-use-case)]
   [:h4 "Expanded data"]
   [expanded-data (clj->js @db/data-to-render)]])

(defn right-split [render]
  [:div
   [:h3 "Rendered data"]
   [:div [render (db/fetch-data-to-render)]]])

(def split-item-style {:width "50%" :padding "0.5em" :min-height "1000px"})
(defn play-ground [render]
  [:div {:style {:display "flex"}}
   [:div {:style split-item-style} [left-split]]
   [:div {:style split-item-style} [right-split render]]])

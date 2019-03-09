(ns ui.frontend.core.renderer)

(defn render [d]
  [:div {:style {:color "red"}} (.stringify js/JSON d)])

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
const SlotPicker = ({ days, onSelectedSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  console.log(days);

  const firstDaywithSlot =
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date;
  const [activeTab, setActiveTab] = useState(firstDaywithSlot);
  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };
  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectedSlot(selectedSlot);
    }
  };
  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className={"flex justify-start w-full overflow-x-auto "}>
          {days.map((day) => (
            <TabsTrigger
              key={day.date}
              value={day.date}
              disabled={day.slots.length === 0}
              className={
                day.slots.length === 0 ? "opacity-50 cursor-not-allowed " : ""
              }
            >
              <div className="flex gap-2">
                <div className="">{format(new Date(day.date), "MMM d")}</div>
                <div className="">{format(new Date(day.date), "EEE")}</div>
              </div>
              {day.slots.length > 0 && (
                <div>
                  <div className="ml-2 bg-emerald-900/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                    {day.slots.length}
                  </div>
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {days.map((day) => (
          <TabsContent key={day.date} value={day.date} className="pt-4">
            {day.slots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No available slots for this day.
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white mb-2">
                  {day.displayDate}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {day.slots.map((slot) => (
                    <Card
                      key={slot.startTime}
                      className={`border-emerald-900/20 cursor-pointer transition-all ${
                        selectedSlot?.startTime === slot.startTime
                          ? "bg-emerald-900/30 border-emerald-600"
                          : "hover:border-emerald-700/40"
                      }`}
                      onClick={() => handleSelectSlot(slot)}
                    >
                      <CardContent className="p-3 flex items-center">
                        <Clock
                          className={`h-4 w-4 mr-2 ${
                            selectedSlot?.startTime === slot.startTime
                              ? "text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={
                            selectedSlot?.startTime === slot.startTime
                              ? "text-white"
                              : "text-muted-foreground"
                          }
                        >
                          {format(new Date(slot.startTime), "h:mm a")}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
        <div className="flex justify-end">
          <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          className={"bg-emerald-600 hover:bg-emerald-700"}>
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default SlotPicker;

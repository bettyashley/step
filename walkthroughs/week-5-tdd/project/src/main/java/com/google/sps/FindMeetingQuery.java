// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

public final class FindMeetingQuery {
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        
        long duration = request.getDuration();
        
        // When the requested meeting duration is greater than a day, there are no viable ranges.
        if (duration > TimeRange.WHOLE_DAY.duration()) {
            return Arrays.asList();
        }
        
        // No events means range should be the entire day.
        if (events.isEmpty()) {
            return Arrays.asList(TimeRange.WHOLE_DAY);
        }

        Collection<String> attendees = request.getAttendees();
        int start = TimeRange.START_OF_DAY;
        int end = TimeRange.END_OF_DAY;
        Collection<TimeRange> ranges = new ArrayList();

        List<Event> sortEvents = new ArrayList<>(events);
        sortEvents.sort((a, b) -> a.getWhen().start() - b.getWhen().start());

        for(Event event: sortEvents) {
            // Event does not contain the attendees, so start time does not need to be changed.
            if (!containsAttendees(event.getAttendees(), attendees)) {
                continue;
            }

            TimeRange eventTimeRange = event.getWhen();
            int eventStart = eventTimeRange.start();
            int eventEnd = eventTimeRange.end();

            // Create and add range if duration condition is statisfied.
            if (eventStart > start && eventStart - start >= duration) {
                ranges.add(TimeRange.fromStartEnd(start, eventStart, false));
            }

            // Deals with nested events case: if the event's end time is later than the current
            // range's start time, then update the start time with the event's end time.
            if (eventEnd > start) {
                start = eventEnd; 
            }
        }

        if (duration <= end - start) {
            ranges.add(TimeRange.fromStartEnd(start, end, true));
        }

        return ranges;
    }

  /**
   * Returns whether any elements in
   * {@code people} and {@code attendees}
   * overlap/share elements
   */
  private boolean containsAttendees(Collection<String> attendees, Collection<String> people) {
    Iterator<String> itr = people.iterator();
    while(itr.hasNext()) {
      String person = itr.next();
      if (attendees.contains(person)) {
        return true;
      }
    }
    return false;
  }
}

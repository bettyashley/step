// Copyright 2020 Google LLC
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

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns comments. */
@WebServlet("/listcomment")
public class ListComment extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int commentCount = getCommentCount(request);
        Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery results = datastore.prepare(query);

        List<String> comments = new ArrayList<>();
        for (Entity entity : results.asIterable()) {
            if (comments.size() == commentCount) break;
            String comment = (String) entity.getProperty("comment");
            comments.add(comment);
        }
        
        response.setContentType("application/json;");
        Gson gson = new Gson();
        String json = gson.toJson(comments);
        response.getWriter().println(json);
    }

    private int getCommentCount(HttpServletRequest request){
        String numCommentString = request.getParameter("num");

        int numComments = -1;
        try {
            numComments = Integer.parseInt(numCommentString);
        } catch (NumberFormatException e) {
            System.err.println("This is not a number: " + numCommentString);
        }

        if (numComments < 0) {
            System.err.println("This is out of range: " + numCommentString);
            numComments = 10;
        }
        return numComments;
    }
}

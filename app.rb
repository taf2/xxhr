#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'

get '/' do
  File.read("index.html")
end

get '/xajax-client.js' do
  File.read("xajax-client.js")
end

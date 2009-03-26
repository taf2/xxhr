#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'

get '/' do
  File.read("co.html")
end

get '/protoculous-effects-shrinkvars.js' do
  File.read("protoculous-effects-shrinkvars.js")
end

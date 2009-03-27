#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'

get '/test' do
  "Hello world!"
end

get '/xajax-worker.js' do
  content_type 'application/x-gears-worker'
  File.read('xajax-worker.js')
end

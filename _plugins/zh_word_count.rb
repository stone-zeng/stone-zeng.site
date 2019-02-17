module Jekyll
  module ZhWordCount
    def zh_word_count(input)
      input.gsub(/<\/?[^>]*>/, "")
           .gsub(/[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/:;<=>\?@\[\\\]\^\_`\{\|\}~]/, " ")
           .gsub(/[，。．；：、！？…—（）《》“”‘’「」【】]/, "")
           .gsub(/([\u4E00-\u9FFF])/, "\\1 ")
           .split.size
    end

    def zh_word_count_k(input)
      zh_word_count(input).fdiv(1000).round(1)
    end
  end
end


Liquid::Template.register_filter(Jekyll::ZhWordCount)

def test(word_count)
  word_count_k = word_count.fdiv(1000).to_i
  word_count_h = (word_count % 1000).fdiv(100).to_i
  word_count_k.to_s + "." + word_count_h.to_s
end
